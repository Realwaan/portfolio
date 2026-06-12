import type { IncomingMessage, ServerResponse } from 'http';

interface ExtendedRequest extends IncomingMessage {
  query?: Record<string, string | string[]>;
}

export default async function handler(req: ExtendedRequest, res: ServerResponse) {
  // Support local Vercel dev query parameters or fallback URL parsing
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const courseCode = (req.query?.courseCode as string) || url.searchParams.get('courseCode') || '';

  if (!courseCode) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing courseCode parameter' }));
    return;
  }

  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server configuration error: Notion credentials missing.' }));
    return;
  }

  try {
    // Normalize code search inputs with and without spacing (e.g. CSIT 111, csit111)
    const normalizedCode = courseCode.replace(/\s+/g, '').toLowerCase();
    const spacedCode = courseCode.includes(' ') 
      ? courseCode 
      : `${courseCode.slice(0, 4)} ${courseCode.slice(4)}`; // e.g. "CSIT 111"

    const queryBody = {
      filter: {
        or: [
          {
            property: 'Name', // Primary title property in Notion
            title: {
              equals: spacedCode
            }
          },
          {
            property: 'Name',
            title: {
              equals: courseCode
            }
          },
          {
            property: 'Name',
            title: {
              equals: normalizedCode
            }
          },
          {
            property: 'Course Code', // Alternate property name
            rich_text: {
              equals: spacedCode
            }
          },
          {
            property: 'Course Code',
            rich_text: {
              equals: courseCode
            }
          }
        ]
      }
    };

    // Query Notion Database for the course page
    const queryResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryBody)
    });

    if (!queryResponse.ok) {
      const errText = await queryResponse.text();
      res.statusCode = queryResponse.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Notion query failed: ${errText}` }));
      return;
    }

    const queryData = (await queryResponse.json()) as any;
    if (!queryData.results || queryData.results.length === 0) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `No Notion page found matching course "${courseCode}".` }));
      return;
    }

    const page = queryData.results[0];
    const pageId = page.id;

    // Query page children blocks (retrieve actual study notes written inside the page body)
    const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!blocksResponse.ok) {
      const errText = await blocksResponse.text();
      res.statusCode = blocksResponse.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Notion blocks retrieval failed: ${errText}` }));
      return;
    }

    const blocksData = (await blocksResponse.json()) as any;

    // Return combined dataset
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      pageId: page.id,
      properties: page.properties,
      blocks: blocksData.results || [],
      icon: page.icon,
      cover: page.cover
    }));

  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `Internal Server Error: ${error.message || error}` }));
  }
}
