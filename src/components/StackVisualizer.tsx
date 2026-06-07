import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Activity, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Edit3, Terminal, CheckCircle, AlertTriangle } from 'lucide-react';

interface Variable {
  name: string;
  type: string;
  val: string | number | boolean | undefined;
  address: string;
}

interface Frame {
  name: string;
  variables: Record<string, Variable>;
  returnLine: number;
  returnVar?: string;
  isIntDecl?: boolean;
  loopInitMap: Record<number, boolean>;
}

interface Step {
  line: number;
  stack: string[];
  variables: Record<string, string | number | boolean | undefined>;
  memory: Record<string, { name: string; val: string | number | boolean | undefined; frameIndex: number }>;
  console: string;
}

// Helper to parse parameter string like "int n", "int* a", "int *b"
function parseParam(paramStr: string) {
  const clean = paramStr.trim();
  const m = clean.match(/^\s*(int|double|float|char)\s*(\*+)?\s*([a-zA-Z_]\w*)\s*$/);
  if (m) {
    return {
      type: m[1] + (m[2] || ''),
      name: m[3]
    };
  }
  return null;
}

// Evaluate a C expression using active variable values and memory addresses
function evaluateCExpr(
  expr: string,
  frameVars: Record<string, Variable>,
  memory: Record<string, { name: string; val: string | number | boolean | undefined; frameIndex: number }>
): string | number | boolean | undefined {
  let sanitized = expr.trim();

  // 1. Handle address-of: &x
  sanitized = sanitized.replace(/&([a-zA-Z_]\w*)/g, (_match, varName) => {
    if (varName in frameVars) {
      return `"${frameVars[varName].address}"`;
    }
    throw new Error(`Variable '${varName}' is not defined.`);
  });

  // 2. Handle pointer dereference: *p
  sanitized = sanitized.replace(/\*([a-zA-Z_]\w*)/g, (_match, varName) => {
    if (varName in frameVars) {
      const addr = frameVars[varName].val;
      if (typeof addr === 'string' && addr.startsWith('0x')) {
        if (addr in memory) {
          return String(memory[addr].val);
        }
        throw new Error(`Pointer '${varName}' points to invalid memory address ${addr}.`);
      }
      throw new Error(`Variable '${varName}' is not a pointer.`);
    }
    return _match;
  });

  // 3. Handle normal variables
  sanitized = sanitized.replace(/\b([a-zA-Z_]\w*)\b/g, (match, varName) => {
    if (varName === 'true') return '1';
    if (varName === 'false') return '0';
    if (varName in frameVars) {
      const v = frameVars[varName].val;
      if (typeof v === 'string' && v.startsWith('0x')) {
        return `"${v}"`;
      }
      return String(v);
    }
    return match;
  });

  // If the expression evaluates to a single string in quotes, return it directly
  if (/^"[0-9a-fA-FxX]+"$/.test(sanitized)) {
    return sanitized.replace(/"/g, '');
  }

  // Safe math evaluation validation
  if (!/^[0-9+\-*/().\s<>=!&|"%xXa-fA-F'"]+$/.test(sanitized)) {
    throw new Error("Invalid characters or operator in expression.");
  }

  try {
    const val = Function(`"use strict"; return (${sanitized});`)();
    return val;
  } catch (err: any) {
    throw new Error(`Mathematical evaluation failed for: ${sanitized}`);
  }
}

// Helper to evaluate condition
function evaluateCondition(
  condStr: string,
  frameVars: Record<string, Variable>,
  memory: Record<string, { name: string; val: any; frameIndex: number }>
): boolean {
  try {
    const val = evaluateCExpr(condStr, frameVars, memory);
    return !!val;
  } catch (err: any) {
    throw new Error(`Condition evaluation failed: ${err.message}`);
  }
}

// Helper to execute update expressions: i++, i--, i += 2, i = i + 1
function executeUpdate(
  expr: string,
  variables: Record<string, Variable>,
  memory: Record<string, { name: string; val: string | number | boolean | undefined; frameIndex: number }>
) {
  const trimmed = expr.trim();
  if (trimmed.endsWith('++')) {
    const varName = trimmed.slice(0, -2).trim();
    if (varName in variables) {
      const currentVal = Number(variables[varName].val) || 0;
      variables[varName].val = currentVal + 1;
      memory[variables[varName].address].val = variables[varName].val;
    }
  } else if (trimmed.endsWith('--')) {
    const varName = trimmed.slice(0, -2).trim();
    if (varName in variables) {
      const currentVal = Number(variables[varName].val) || 0;
      variables[varName].val = currentVal - 1;
      memory[variables[varName].address].val = variables[varName].val;
    }
  } else if (trimmed.includes('+=')) {
    const parts = trimmed.split('+=');
    const varName = parts[0].trim();
    const addVal = evaluateCExpr(parts[1], variables, memory);
    if (varName in variables) {
      const currentVal = Number(variables[varName].val) || 0;
      const amount = Number(addVal) || 0;
      variables[varName].val = currentVal + amount;
      memory[variables[varName].address].val = variables[varName].val;
    }
  } else if (trimmed.includes('-=')) {
    const parts = trimmed.split('-=');
    const varName = parts[0].trim();
    const subVal = evaluateCExpr(parts[1], variables, memory);
    if (varName in variables) {
      const currentVal = Number(variables[varName].val) || 0;
      const amount = Number(subVal) || 0;
      variables[varName].val = currentVal - amount;
      memory[variables[varName].address].val = variables[varName].val;
    }
  } else {
    const match = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (match) {
      const varName = match[1];
      const val = evaluateCExpr(match[2], variables, memory);
      if (varName in variables) {
        variables[varName].val = val;
        memory[variables[varName].address].val = val;
      }
    }
  }
}

// Custom parser to compile simple C code statements and loops into simulator steps
function parseCustomCode(codeStr: string): { steps: Step[]; codeLines: string[]; error?: string } {
  const rawLines = codeStr.split('\n');
  const codeLines: string[] = [];
  
  rawLines.forEach((line) => {
    codeLines.push(line);
  });
  
  const cleanLines = codeLines.map(line => line.replace(/\/\/.*$/, '').trim());

  interface FunctionDef {
    name: string;
    returnType: string;
    params: { type: string; name: string }[];
    startLine: number;
    bodyStartLine: number;
    endLine: number;
  }
  const functions: Record<string, FunctionDef> = {};

  // 1. Scan for function declarations
  for (let i = 0; i < cleanLines.length; i++) {
    const line = cleanLines[i];
    const funcMatch = line.match(/^\s*(void|int|double|float)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{?$/);
    if (funcMatch) {
      const returnType = funcMatch[1];
      const funcName = funcMatch[2];
      const paramsStr = funcMatch[3];
      
      const params: { type: string; name: string }[] = [];
      if (paramsStr.trim() !== '') {
        const parts = paramsStr.split(',');
        for (const p of parts) {
          const parsed = parseParam(p);
          if (parsed) params.push(parsed);
        }
      }
      
      let depth = 0;
      let endLine = -1;
      for (let j = i; j < cleanLines.length; j++) {
        const checkLine = cleanLines[j];
        for (let c = 0; c < checkLine.length; c++) {
          if (checkLine[c] === '{') depth++;
          else if (checkLine[c] === '}') {
            depth--;
            if (depth === 0) {
              endLine = j;
              break;
            }
          }
        }
        if (endLine !== -1) break;
      }
      
      if (endLine === -1) {
        return {
          steps: [],
          codeLines,
          error: `Line ${i + 1}: Syntax error - function '${funcName}' is missing matching closing brace '}'.`
        };
      }
      
      functions[funcName] = {
        name: funcName,
        returnType,
        params,
        startLine: i,
        bodyStartLine: i + 1,
        endLine
      };
    }
  }

  const hasFunctions = Object.keys(functions).length > 0;
  if (!hasFunctions) {
    // Treat whole file as synthetic main()
    functions['main'] = {
      name: 'main',
      returnType: 'int',
      params: [],
      startLine: 0,
      bodyStartLine: 0,
      endLine: cleanLines.length - 1
    };
  } else if (!functions['main']) {
    return {
      steps: [],
      codeLines,
      error: "Compilation error: No main() function found in program."
    };
  }

  // 2. Build jump tables for loops & conditionals within functions
  interface JumpInfo {
    type: string;
    endLine: number;
    startLine?: number;
    condStr?: string;
    initStr?: string;
    updateStr?: string;
    elseStartLine?: number;
    elseEndLine?: number;
  }
  const jumps: Record<number, JumpInfo> = {};

  for (const funcName in functions) {
    const func = functions[funcName];
    const blockStack: { type: string; startLine: number; data?: any }[] = [];
    
    for (let j = func.bodyStartLine; j < func.endLine; j++) {
      const line = cleanLines[j];
      
      // If without braces (single statement if)
      const ifNoBraceMatch = line.match(/^if\s*\(([^)]+)\)\s*$/);
      if (ifNoBraceMatch) {
        const condStr = ifNoBraceMatch[1];
        jumps[j] = {
          type: 'if_no_brace',
          condStr,
          endLine: j + 1
        };
        continue;
      }
      
      if (line.includes('{')) {
        let blockType = 'block';
        let condStr = '';
        let initStr = '';
        let updateStr = '';
        
        if (line.match(/^if\s*\(/)) {
          blockType = 'if';
          condStr = (line.match(/^if\s*\((.+?)\)/) || [])[1] || '';
        } else if (line.match(/^else\s*if\s*\(/)) {
          blockType = 'if';
          condStr = (line.match(/^else\s*if\s*\((.+?)\)/) || [])[1] || '';
        } else if (line.match(/^else/)) {
          blockType = 'else';
        } else if (line.match(/^while\s*\(/)) {
          blockType = 'while';
          condStr = (line.match(/^while\s*\((.+?)\)/) || [])[1] || '';
        } else if (line.match(/^for\s*\(/)) {
          blockType = 'for';
          const forParts = line.match(/^for\s*\(([^;]*);([^;]*);([^)]*)\)/);
          if (forParts) {
            initStr = forParts[1];
            condStr = forParts[2];
            updateStr = forParts[3];
          }
        }
        
        blockStack.push({ type: blockType, startLine: j, data: { condStr, initStr, updateStr } });
      }
      
      if (line.includes('}')) {
        const block = blockStack.pop();
        if (block) {
          jumps[block.startLine] = {
            type: block.type,
            endLine: j,
            ...block.data
          };
          jumps[j] = {
            type: block.type + '_end',
            startLine: block.startLine,
            ...block.data
          };
          
          if (block.type === 'else') {
            let foundIfStart = -1;
            for (const startStr in jumps) {
              const start = parseInt(startStr);
              const info = jumps[start];
              if (info.type === 'if' && (info.endLine === block.startLine || info.endLine === block.startLine - 1)) {
                foundIfStart = start;
                break;
              }
            }
            if (foundIfStart !== -1) {
              jumps[foundIfStart].elseStartLine = block.startLine;
              jumps[foundIfStart].elseEndLine = j;
            }
          }
        }
      }
    }
  }

  // 3. Execution Simulation Loop
  const steps: Step[] = [];
  const callStack: Frame[] = [];
  const memory: Record<string, { name: string; val: any; frameIndex: number }> = {};
  let addressCounter = 0x7ffcd0;
  let consoleLog = "Starting program...\n";
  
  const mainFunc = functions['main'];
  callStack.push({
    name: 'main',
    variables: {},
    returnLine: -1,
    loopInitMap: {}
  });
  consoleLog += "main() frame pushed.";
  
  let ip = mainFunc.bodyStartLine;
  const stepsLimit = 400;
  let stepCount = 0;

  while (ip < cleanLines.length && stepCount < stepsLimit) {
    stepCount++;
    const line = cleanLines[ip];
    
    const currentFrame = callStack[callStack.length - 1];
    const activeFunc = functions[currentFrame.name];
    
    // UI Call stack layout
    const uiStack = callStack.map((f) => {
      if (f.name === 'main') return 'main()';
      const fDef = functions[f.name];
      const params = Object.values(f.variables)
        .filter((v) => fDef && fDef.params.some(p => p.name === v.name))
        .map((v) => `${v.name}=${v.val}`)
        .join(', ');
      return `${f.name}(${params})`;
    });

    const uiVariables: Record<string, any> = {};
    for (const name in currentFrame.variables) {
      uiVariables[name] = currentFrame.variables[name].val;
    }

    steps.push({
      line: ip + 1,
      stack: uiStack,
      variables: uiVariables,
      memory: JSON.parse(JSON.stringify(memory)),
      console: consoleLog
    });

    // Check if we hit closing brace of active function
    if (ip === activeFunc.endLine) {
      if (callStack.length > 1) {
        const popped = callStack.pop()!;
        for (const varName in popped.variables) {
          delete memory[popped.variables[varName].address];
        }
        consoleLog += `\nExiting ${popped.name}(). Frame popped.`;
        ip = popped.returnLine;
        continue;
      } else {
        consoleLog += `\nProgram completed. Exit code: 0.`;
        break;
      }
    }

    if (!line || line === '{' || line === '}' || line.startsWith('//')) {
      ip++;
      continue;
    }
    
    const jump = jumps[ip];
    
    if (jump) {
      if (jump.type === 'if_no_brace') {
        try {
          const condVal = evaluateCondition(jump.condStr!, currentFrame.variables, memory);
          if (condVal) {
            consoleLog += `\nLine ${ip + 1}: condition "${jump.condStr}" is true. Executing statement.`;
            ip++;
          } else {
            consoleLog += `\nLine ${ip + 1}: condition "${jump.condStr}" is false. Skipping statement.`;
            ip = jump.endLine + 1;
          }
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
        continue;
      }

      if (jump.type === 'if') {
        try {
          const condVal = evaluateCondition(jump.condStr!, currentFrame.variables, memory);
          if (condVal) {
            consoleLog += `\nLine ${ip + 1}: condition "${jump.condStr}" is true. Entering if branch.`;
            ip++;
          } else {
            consoleLog += `\nLine ${ip + 1}: condition "${jump.condStr}" is false.`;
            if (jump.elseStartLine !== undefined) {
              ip = jump.elseStartLine;
            } else {
              ip = jump.endLine + 1;
            }
          }
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
        continue;
      }

      if (jump.type === 'else') {
        ip = jump.endLine + 1;
        continue;
      }

      if (jump.type === 'if_end') {
        const ifHeader = jumps[jump.startLine!];
        if (ifHeader && ifHeader.elseEndLine !== undefined) {
          ip = ifHeader.elseEndLine + 1;
        } else {
          ip++;
        }
        continue;
      }

      if (jump.type === 'while') {
        try {
          const condVal = evaluateCondition(jump.condStr!, currentFrame.variables, memory);
          if (condVal) {
            consoleLog += `\nLine ${ip + 1}: while condition "${jump.condStr}" is true. Entering loop body.`;
            ip++;
          } else {
            consoleLog += `\nLine ${ip + 1}: while condition "${jump.condStr}" is false. Exiting loop.`;
            ip = jump.endLine + 1;
          }
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
        continue;
      }

      if (jump.type === 'while_end') {
        ip = jump.startLine!;
        continue;
      }

      if (jump.type === 'for') {
        try {
          if (!currentFrame.loopInitMap[ip]) {
            const initText = jump.initStr!.trim();
            if (initText) {
              if (initText.startsWith('int ') || initText.startsWith('double ') || initText.startsWith('float ')) {
                const declMatch = initText.match(/^(int|double|float)\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
                if (declMatch) {
                  const varType = declMatch[1];
                  const varName = declMatch[2];
                  const initExpr = declMatch[3];
                  const val = evaluateCExpr(initExpr, currentFrame.variables, memory);
                  const addr = `0x${addressCounter.toString(16)}`;
                  addressCounter += 4;
                  currentFrame.variables[varName] = { name: varName, type: varType, val, address: addr };
                  memory[addr] = { name: varName, val, frameIndex: callStack.length - 1 };
                  consoleLog += `\n[Loop Init]: Declared ${varType} ${varName} = ${val}`;
                }
              } else {
                const assignMatch = initText.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
                if (assignMatch) {
                  const varName = assignMatch[1];
                  const initExpr = assignMatch[2];
                  const val = evaluateCExpr(initExpr, currentFrame.variables, memory);
                  if (varName in currentFrame.variables) {
                    currentFrame.variables[varName].val = val;
                    memory[currentFrame.variables[varName].address].val = val;
                  }
                  consoleLog += `\n[Loop Init]: Assigned ${varName} = ${val}`;
                }
              }
            }
            currentFrame.loopInitMap[ip] = true;
          }

          const condVal = evaluateCondition(jump.condStr!, currentFrame.variables, memory);
          if (condVal) {
            consoleLog += `\nLine ${ip + 1}: loop condition "${jump.condStr}" is true. Entering loop body.`;
            ip++;
          } else {
            consoleLog += `\nLine ${ip + 1}: loop condition "${jump.condStr}" is false. Exiting loop.`;
            const initText = jump.initStr!.trim();
            if (initText.startsWith('int ') || initText.startsWith('double ') || initText.startsWith('float ')) {
              const varName = (initText.match(/^(?:int|double|float)\s+([a-zA-Z_]\w*)/) || [])[1];
              if (varName && varName in currentFrame.variables) {
                const addr = currentFrame.variables[varName].address;
                delete memory[addr];
                delete currentFrame.variables[varName];
              }
            }
            currentFrame.loopInitMap[ip] = false;
            ip = jump.endLine + 1;
          }
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
        continue;
      }

      if (jump.type === 'for_end') {
        const startLine = jump.startLine!;
        const loopHeader = jumps[startLine];
        try {
          executeUpdate(loopHeader.updateStr!, currentFrame.variables, memory);
          consoleLog += `\n[Loop Update]: Executed ${loopHeader.updateStr}`;
          ip = startLine;
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
        continue;
      }
    }

    // A. Printf statement
    const printMatch = line.match(/^printf\s*\(\s*"([^"]*)"\s*(?:,\s*(.+)\s*)?\)\s*;?$/);
    if (printMatch) {
      const formatStr = printMatch[1];
      const argsStr = printMatch[2];
      let formatted = formatStr;
      
      if (argsStr) {
        const args = argsStr.split(',').map(arg => arg.trim());
        try {
          const vals = args.map(arg => evaluateCExpr(arg, currentFrame.variables, memory));
          let idx = 0;
          formatted = formatStr.replace(/%(d|f|lf|s|g)/g, (match) => {
            if (idx < vals.length) {
              return String(vals[idx++]);
            }
            return match;
          });
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
      }
      formatted = formatted.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      consoleLog += `\n[STDOUT]: ${formatted}`;
      ip++;
      continue;
    }

    // B. Return statement
    const returnMatch = line.match(/^return\s*(.*)\s*;?$/);
    if (returnMatch) {
      const retExpr = returnMatch[1].trim().replace(/;$/, '');
      let retVal: any = undefined;
      
      if (retExpr !== '') {
        try {
          retVal = evaluateCExpr(retExpr, currentFrame.variables, memory);
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
      }

      const popped = callStack.pop()!;
      for (const varName in popped.variables) {
        delete memory[popped.variables[varName].address];
      }

      consoleLog += `\nExiting ${popped.name}(). Frame popped.`;
      
      if (callStack.length > 0) {
        const parentFrame = callStack[callStack.length - 1];
        if (popped.returnVar) {
          if (popped.isIntDecl) {
            const addr = `0x${addressCounter.toString(16)}`;
            addressCounter += 4;
            parentFrame.variables[popped.returnVar] = {
              name: popped.returnVar,
              type: 'int',
              val: retVal,
              address: addr
            };
            memory[addr] = { name: popped.returnVar, val: retVal, frameIndex: callStack.length - 1 };
            consoleLog += `\nAllocated returned variable ${popped.returnVar} = ${retVal}`;
          } else {
            if (popped.returnVar.startsWith('*')) {
              const ptrName = popped.returnVar.slice(1).trim();
              if (ptrName in parentFrame.variables) {
                const targetAddr = parentFrame.variables[ptrName].val;
                if (typeof targetAddr === 'string' && targetAddr in memory) {
                  memory[targetAddr].val = retVal;
                  for (const f of callStack) {
                    for (const v in f.variables) {
                      if (f.variables[v].address === targetAddr) {
                        f.variables[v].val = retVal;
                      }
                    }
                  }
                }
              }
            } else {
              if (popped.returnVar in parentFrame.variables) {
                parentFrame.variables[popped.returnVar].val = retVal;
                memory[parentFrame.variables[popped.returnVar].address].val = retVal;
              }
            }
            consoleLog += `\nReturned value assigned to ${popped.returnVar} = ${retVal}`;
          }
        }
        ip = popped.returnLine;
      } else {
        consoleLog += `\nProgram completed with exit code: ${retVal || 0}.`;
        break;
      }
      continue;
    }

    // C. Variable declarations
    const declMatch = line.match(/^\s*(int|double|float|char)\s*(\*+)?\s*([a-zA-Z_]\w*)\s*(?:=\s*(.+))?;?$/);
    if (declMatch) {
      const varType = declMatch[1] + (declMatch[2] || '');
      const varName = declMatch[3];
      const rhsExpr = declMatch[4] ? declMatch[4].trim().replace(/;$/, '') : undefined;
      
      if (rhsExpr) {
        const funcCallMatch = rhsExpr.match(/^([a-zA-Z_]\w*)\s*\(([^)]*)\)$/);
        if (funcCallMatch) {
          const calledFuncName = funcCallMatch[1];
          const argsStr = funcCallMatch[2];
          
          if (calledFuncName in functions) {
            const targetFunc = functions[calledFuncName];
            const evaluatedArgs: any[] = [];
            if (argsStr.trim() !== '') {
              const argExprs = argsStr.split(',');
              for (const expr of argExprs) {
                try {
                  evaluatedArgs.push(evaluateCExpr(expr, currentFrame.variables, memory));
                } catch (err: any) {
                  return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
                }
              }
            }
            
            const newVariables: Record<string, Variable> = {};
            targetFunc.params.forEach((param, idx) => {
              const val = evaluatedArgs[idx] !== undefined ? evaluatedArgs[idx] : 0;
              const addr = `0x${addressCounter.toString(16)}`;
              addressCounter += 4;
              newVariables[param.name] = { name: param.name, type: param.type, val, address: addr };
              memory[addr] = { name: param.name, val, frameIndex: callStack.length };
            });
            
            callStack.push({
              name: calledFuncName,
              variables: newVariables,
              returnLine: ip + 1,
              returnVar: varName,
              isIntDecl: true,
              loopInitMap: {}
            });
            
            consoleLog += `\nCalling function ${calledFuncName}(). Push frame.`;
            ip = targetFunc.bodyStartLine;
            continue;
          } else {
            return { steps: [], codeLines, error: `Line ${ip + 1}: Undefined function '${calledFuncName}'.` };
          }
        } else {
          try {
            const val = evaluateCExpr(rhsExpr, currentFrame.variables, memory);
            const addr = `0x${addressCounter.toString(16)}`;
            addressCounter += 4;
            currentFrame.variables[varName] = { name: varName, type: varType, val, address: addr };
            memory[addr] = { name: varName, val, frameIndex: callStack.length - 1 };
            consoleLog += `\nLine ${ip + 1}: Allocated ${varType} ${varName} = ${val}`;
          } catch (err: any) {
            return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
          }
        }
      } else {
        const addr = `0x${addressCounter.toString(16)}`;
        addressCounter += 4;
        currentFrame.variables[varName] = { name: varName, type: varType, val: 0, address: addr };
        memory[addr] = { name: varName, val: 0, frameIndex: callStack.length - 1 };
        consoleLog += `\nLine ${ip + 1}: Allocated uninitialized ${varType} ${varName} = 0`;
      }
      ip++;
      continue;
    }

    // D. Assignments
    const assignMatch = line.match(/^([^=]+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const lhs = assignMatch[1].trim();
      const rhsExpr = assignMatch[2].trim().replace(/;$/, '');
      
      const funcCallMatch = rhsExpr.match(/^([a-zA-Z_]\w*)\s*\(([^)]*)\)$/);
      if (funcCallMatch) {
        const calledFuncName = funcCallMatch[1];
        const argsStr = funcCallMatch[2];
        
        if (calledFuncName in functions) {
          const targetFunc = functions[calledFuncName];
          const evaluatedArgs: any[] = [];
          if (argsStr.trim() !== '') {
            const argExprs = argsStr.split(',');
            for (const expr of argExprs) {
              try {
                evaluatedArgs.push(evaluateCExpr(expr, currentFrame.variables, memory));
              } catch (err: any) {
                return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
              }
            }
          }
          
          const newVariables: Record<string, Variable> = {};
          targetFunc.params.forEach((param, idx) => {
            const val = evaluatedArgs[idx] !== undefined ? evaluatedArgs[idx] : 0;
            const addr = `0x${addressCounter.toString(16)}`;
            addressCounter += 4;
            newVariables[param.name] = { name: param.name, type: param.type, val, address: addr };
            memory[addr] = { name: param.name, val, frameIndex: callStack.length };
          });
          
          callStack.push({
            name: calledFuncName,
            variables: newVariables,
            returnLine: ip + 1,
            returnVar: lhs,
            isIntDecl: false,
            loopInitMap: {}
          });
          
          consoleLog += `\nCalling function ${calledFuncName}(). Push frame.`;
          ip = targetFunc.bodyStartLine;
          continue;
        } else {
          return { steps: [], codeLines, error: `Line ${ip + 1}: Undefined function '${calledFuncName}'.` };
        }
      } else {
        try {
          const val = evaluateCExpr(rhsExpr, currentFrame.variables, memory);
          if (lhs.startsWith('*')) {
            const ptrName = lhs.slice(1).trim();
            if (ptrName in currentFrame.variables) {
              const targetAddr = currentFrame.variables[ptrName].val;
              if (typeof targetAddr === 'string' && targetAddr in memory) {
                memory[targetAddr].val = val;
                for (const f of callStack) {
                  for (const v in f.variables) {
                    if (f.variables[v].address === targetAddr) {
                      f.variables[v].val = val;
                    }
                  }
                }
                consoleLog += `\nLine ${ip + 1}: Dereferenced pointer ${ptrName} and assigned *${ptrName} = ${val}`;
              } else {
                return { steps: [], codeLines, error: `Line ${ip + 1}: Pointer '${ptrName}' points to unallocated address '${targetAddr || "NULL"}'.` };
              }
            } else {
              return { steps: [], codeLines, error: `Line ${ip + 1}: Pointer variable '${ptrName}' is not defined.` };
            }
          } else {
            if (lhs in currentFrame.variables) {
              currentFrame.variables[lhs].val = val;
              memory[currentFrame.variables[lhs].address].val = val;
              consoleLog += `\nLine ${ip + 1}: Assigned ${lhs} = ${val}`;
            } else {
              return { steps: [], codeLines, error: `Line ${ip + 1}: Variable '${lhs}' is not defined.` };
            }
          }
        } catch (err: any) {
          return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
        }
      }
      ip++;
      continue;
    }

    // E. Stand-alone function call
    const standAloneCallMatch = line.match(/^([a-zA-Z_]\w*)\s*\(([^)]*)\);?$/);
    if (standAloneCallMatch) {
      const calledFuncName = standAloneCallMatch[1];
      const argsStr = standAloneCallMatch[2];
      
      if (calledFuncName in functions) {
        const targetFunc = functions[calledFuncName];
        const evaluatedArgs: any[] = [];
        if (argsStr.trim() !== '') {
          const argExprs = argsStr.split(',');
          for (const expr of argExprs) {
            try {
              evaluatedArgs.push(evaluateCExpr(expr, currentFrame.variables, memory));
            } catch (err: any) {
              return { steps: [], codeLines, error: `Line ${ip + 1}: ${err.message}` };
            }
          }
        }
        
        const newVariables: Record<string, Variable> = {};
        targetFunc.params.forEach((param, idx) => {
          const val = evaluatedArgs[idx] !== undefined ? evaluatedArgs[idx] : 0;
          const addr = `0x${addressCounter.toString(16)}`;
          addressCounter += 4;
          newVariables[param.name] = { name: param.name, type: param.type, val, address: addr };
          memory[addr] = { name: param.name, val, frameIndex: callStack.length };
        });
        
        callStack.push({
          name: calledFuncName,
          variables: newVariables,
          returnLine: ip + 1,
          loopInitMap: {}
        });
        
        consoleLog += `\nCalling function ${calledFuncName}(). Push frame.`;
        ip = targetFunc.bodyStartLine;
        continue;
      } else {
        return { steps: [], codeLines, error: `Line ${ip + 1}: Undefined function '${calledFuncName}'.` };
      }
    }

    return {
      steps: [],
      codeLines,
      error: `Line ${ip + 1}: Syntax error - unknown statement "${line}". Use C-style code like "int x = 5;", "swap(&x, &y);", or "printf("%d", x);"`
    };
  }

  if (stepCount >= stepsLimit) {
    return {
      steps: [],
      codeLines,
      error: `Execution terminated: Step limit reached (likely infinite recursion or loop).`
    };
  }

  // Final Program Finished Step
  const uiStack = callStack.map((f) => {
    if (f.name === 'main') return 'main()';
    const fDef = functions[f.name];
    const params = Object.values(f.variables)
      .filter((v) => fDef && fDef.params.some(p => p.name === v.name))
      .map((v) => `${v.name}=${v.val}`)
      .join(', ');
    return `${f.name}(${params})`;
  });

  steps.push({
    line: codeLines.length + 1,
    stack: uiStack,
    variables: {},
    memory: JSON.parse(JSON.stringify(memory)),
    console: consoleLog + "\nProgram finished."
  });

  return { steps, codeLines };
}

// C code syntax templates with parameter binding
const getFibCode = (n: number) => [
  "int fib(int n) {",
  "  if (n <= 1) {",
  "    return n;",
  "  }",
  "  int f1 = fib(n - 1);",
  "  int f2 = fib(n - 2);",
  "  return f1 + f2;",
  "}",
  "int main() {",
  `  int result = fib(${n});`,
  "}"
];

const getSwapCode = (x: number, y: number) => [
  "void swap(int* a, int* b) {",
  "  int temp = *a;",
  "  *a = *b;",
  "  *b = temp;",
  "}",
  "int main() {",
  `  int x = ${x};`,
  `  int y = ${y};`,
  "  swap(&x, &y);",
  "}"
];

// Color mapping helper to give variables and operations matched colors
const getVarColor = (name: string): string => {
  const clean = name.replace(/\(.*\)/, '').trim(); 
  if (clean === 'x' || clean === 'a') return '#fb923c'; // orange
  if (clean === 'y' || clean === 'b') return '#60a5fa'; // blue
  if (clean === 'sum' || clean === 'result') return '#34d399'; // emerald
  if (clean === 'temp') return '#f472b6'; // pink
  if (clean === 'i') return '#c084fc'; // purple
  if (clean.startsWith('fib')) return '#f87171'; // red
  return '#9ca3af'; // gray
};

export const StackVisualizer: React.FC = () => {
  const [snippet, setSnippet] = useState<'fib' | 'swap' | 'custom'>('fib');
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dynamic values
  const [fibN, setFibN] = useState<number>(3);
  const [swapX, setSwapX] = useState<number>(42);
  const [swapY, setSwapY] = useState<number>(99);
  
  // Auto-run play speed (0.5x, 1x, 2x)
  const [speed, setSpeed] = useState<number>(1);

  // Custom code inputs
  const [customCode, setCustomCode] = useState<string>(
    `// Write simple C code (int, double, float, printf, for loop)!\nint sum = 0;\nfor (int i = 0; i < 3; i++) {\n  sum = sum + i;\n}\nprintf("sum = %d\\n", sum);`
  );
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(true);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [compileSuccess, setCompileSuccess] = useState<boolean>(false);

  // Generated steps state
  const [simulationSteps, setSimulationSteps] = useState<Step[]>([]);
  const [simulationCodeLines, setSimulationCodeLines] = useState<string[]>([]);

  // Textarea and line-number gutter scroll references
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineGutterRef = useRef<HTMLDivElement>(null);

  const handleTextareaScroll = () => {
    if (textareaRef.current && lineGutterRef.current) {
      lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Sync scrolling when customCode edits trigger gutter resizing
  useEffect(() => {
    if (textareaRef.current && lineGutterRef.current) {
      lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [customCode, isEditingCustom]);

  // Regenerate steps dynamically based on inputs
  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (!active) return;

      if (snippet === 'fib') {
        const code = getFibCode(fibN).join('\n');
        const { steps, codeLines, error } = parseCustomCode(code);
        if (error) {
          setCompileError(error);
        } else {
          setSimulationSteps(steps);
          setSimulationCodeLines(codeLines);
          setStep(0);
          setIsRunning(false);
          setCompileError(null);
        }
      } else if (snippet === 'swap') {
        const code = getSwapCode(swapX, swapY).join('\n');
        const { steps, codeLines, error } = parseCustomCode(code);
        if (error) {
          setCompileError(error);
        } else {
          setSimulationSteps(steps);
          setSimulationCodeLines(codeLines);
          setStep(0);
          setIsRunning(false);
          setCompileError(null);
        }
      } else {
        if (isEditingCustom) {
          setSimulationSteps([]);
          setSimulationCodeLines([]);
        }
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet, fibN, swapX, swapY]);

  const handleCompileCustom = () => {
    setIsCompiling(true);
    setCompileError(null);
    setCompileSuccess(false);

    setTimeout(() => {
      const { steps, codeLines, error } = parseCustomCode(customCode);
      setIsCompiling(false);
      if (error) {
        setCompileError(error);
        setCompileSuccess(false);
      } else {
        setCompileError(null);
        setCompileSuccess(true);
        setSimulationSteps(steps);
        setSimulationCodeLines(codeLines);
        setStep(0);
        setIsRunning(false);
        setTimeout(() => {
          setIsEditingCustom(false);
          setCompileSuccess(false);
        }, 800);
      }
    }, 600);
  };

  const handleNext = () => {
    setStep((prev) => Math.min(simulationSteps.length - 1, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
  };

  const handleToggleAuto = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (isRunning && simulationSteps.length > 0) {
      const intervalMs = Math.round(1400 / speed);
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev >= simulationSteps.length - 1) {
            setIsRunning(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, simulationSteps, speed]);

  const currentStep = simulationSteps[step] || null;

  // Code editor lines counter
  const lineCount = customCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(8, lineCount) }, (_, i) => i + 1);

  return (
    <div className="stack-visualizer-container">
      {/* Top Selector & Parameter Panel */}
      <div className="visualizer-controls-row">
        <select 
          className="visualizer-selector"
          value={snippet}
          onChange={(e) => {
            const nextType = e.target.value as 'fib' | 'swap' | 'custom';
            setSnippet(nextType);
            if (nextType === 'custom') {
              setIsEditingCustom(true);
            }
          }}
        >
          <option value="fib">C Recursive Fibonacci</option>
          <option value="swap">C Pointer Swap (&x, &y)</option>
          <option value="custom">Custom C Simulator Console</option>
        </select>

        {/* Dynamic Inputs */}
        {snippet === 'fib' && (
          <div className="visualizer-input-group">
            <span className="visualizer-input-label">n:</span>
            <input 
              type="number" 
              className="visualizer-number-input"
              value={fibN}
              onChange={(e) => setFibN(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
              min={0}
              max={5}
            />
          </div>
        )}

        {snippet === 'swap' && (
          <div className="visualizer-input-group">
            <span className="visualizer-input-label">x:</span>
            <input 
              type="number" 
              className="visualizer-number-input"
              value={swapX}
              onChange={(e) => setSwapX(parseInt(e.target.value) || 0)}
              style={{ marginRight: 6 }}
            />
            <span className="visualizer-input-label">y:</span>
            <input 
              type="number" 
              className="visualizer-number-input"
              value={swapY}
              onChange={(e) => setSwapY(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        {/* Simulation Action Controls */}
        {(!isEditingCustom || snippet !== 'custom') && (
          <div className="visualizer-btn-group">
            {snippet === 'custom' && (
              <button className="visualizer-btn" onClick={() => setIsEditingCustom(true)}>
                <Edit3 size={11} /> Edit
              </button>
            )}
            <button className="visualizer-btn" onClick={handleBack} disabled={step === 0}>
              <ChevronLeft size={12} /> Back
            </button>
            
            {/* Speed Selector */}
            <div className="visualizer-speed-selector-wrapper">
              <select 
                className="visualizer-speed-select"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                title="Play speed multiplier"
              >
                <option value={0.5}>0.5x</option>
                <option value={1.0}>1.0x</option>
                <option value={2.0}>2.0x</option>
              </select>
            </div>

            <button 
              className={`visualizer-btn ${isRunning ? 'active-run' : ''}`}
              onClick={handleToggleAuto}
              disabled={simulationSteps.length === 0 || step === simulationSteps.length - 1}
            >
              {isRunning ? <Pause size={11} /> : <Play size={11} />}
              {isRunning ? 'Pause' : 'Auto'}
            </button>
            <button className="visualizer-btn" onClick={handleNext} disabled={simulationSteps.length === 0 || step === simulationSteps.length - 1}>
              Next <ChevronRight size={12} />
            </button>
            <button className="visualizer-btn" onClick={handleReset}>
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace: Code Editor vs Code Simulator */}
      {snippet === 'custom' && isEditingCustom ? (
        <div className="custom-code-editor-container">
          {compileError && (
            <div className="compiler-feedback error">
              <AlertTriangle size={14} />
              <span>{compileError}</span>
            </div>
          )}
          {compileSuccess && (
            <div className="compiler-feedback success">
              <CheckCircle size={14} />
              <span>Compilation Successful! Loading simulator...</span>
            </div>
          )}
          {isCompiling && (
            <div className="compiler-feedback" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', color: '#60a5fa' }}>
              <span className="spinner-dots">Compiling main.c using GCC</span>
            </div>
          )}
          
          <div className="editor-workspace">
            {/* Gutter numbers */}
            <div className="editor-gutter" ref={lineGutterRef}>
              {lineNumbers.map((num) => (
                <div key={num} className="editor-gutter-line">
                  {num}
                </div>
              ))}
            </div>
            {/* Textarea code inputs */}
            <textarea
              ref={textareaRef}
              className="custom-code-editor"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              onScroll={handleTextareaScroll}
              placeholder="Type your C declarations, assignments, for loops, and printfs here..."
              spellCheck="false"
            />
          </div>
          
          <div className="editor-controls-row">
            <span style={{ fontSize: '10px', color: 'var(--text-dimmed)', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Terminal size={11} /> Supports: int, double, float, for loops, assignments, printf
            </span>
            <button 
              className="visualizer-btn active-run" 
              onClick={handleCompileCustom} 
              disabled={isCompiling}
              style={{ padding: '6px 12px', fontWeight: 600 }}
            >
              Compile & Run Code
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="visualizer-grid">
            {/* Code Highlight Box */}
            <div className="code-sim-box">
              {simulationCodeLines.map((line, idx) => {
                const lineNo = idx + 1;
                const isActive = currentStep ? lineNo === currentStep.line : false;
                return (
                  <div key={idx} className={`sim-code-line ${isActive ? 'active' : ''}`}>
                    <span className="sim-line-no">{lineNo}</span>
                    <span className="sim-line-content">{line}</span>
                  </div>
                );
              })}
            </div>

            {/* Stack/Memory Visualizer Pane */}
            <div className="visualizer-right-pane">
              {/* Call Stack Frame */}
              <div className="stack-sim-box">
                <div className="sim-section-title">
                  <Cpu size={11} /> Call Stack
                </div>
                <div className="stack-frames-list">
                  {!currentStep || currentStep.stack.length === 0 ? (
                    <div style={{ color: 'var(--text-dimmed)', fontStyle: 'italic', fontSize: '10px', textAlign: 'center', marginTop: 10 }}>
                      Stack Empty (Process Idle)
                    </div>
                  ) : (
                    currentStep.stack.map((frame, idx) => {
                      const isTop = idx === currentStep.stack.length - 1;
                      return (
                        <div key={idx} className={`stack-frame-item ${isTop ? 'top-frame' : ''}`}>
                          <div className="frame-title">{frame}</div>
                          {isTop && Object.keys(currentStep.variables).length > 0 && (
                            <div className="frame-variables">
                              {Object.entries(currentStep.variables).map(([name, val]) => (
                                <span 
                                  key={name} 
                                  className="var-badge" 
                                  style={{ borderColor: getVarColor(name), color: getVarColor(name) }}
                                >
                                  {name}={val}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Memory Address Table */}
              <div className="memory-sim-box">
                <div className="sim-section-title">
                  <Activity size={11} /> Memory (Stack/Heap)
                </div>
                {currentStep && currentStep.memory && Object.keys(currentStep.memory).length > 0 ? (
                  <div className="memory-table">
                    {Object.entries(currentStep.memory).map(([addr, item]) => {
                      const isSwapping = item.name.includes('(swapping)');
                      const isPointerTargetA = snippet === 'swap' && item.name === 'x' && currentStep.variables['a'] === addr;
                      const isPointerTargetB = snippet === 'swap' && item.name === 'y' && currentStep.variables['b'] === addr;
                      
                      return (
                        <div key={addr} className={`memory-row ${isSwapping ? 'swapping' : ''}`}>
                          <span className="mem-addr">{addr}</span>
                          <span className="mem-val">
                            <span style={{ color: getVarColor(item.name), fontWeight: 600 }}>{item.name}</span>: <strong>{item.val}</strong>
                            {isPointerTargetA && (
                              <span className="pointer-target-label" style={{ color: getVarColor('a') }}>
                                &larr; *a
                              </span>
                            )}
                            {isPointerTargetB && (
                              <span className="pointer-target-label" style={{ color: getVarColor('b') }}>
                                &larr; *b
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-dimmed)', fontStyle: 'italic', fontSize: '10.5px', padding: '4px 6px', lineHeight: '1.4' }}>
                    {snippet === 'fib' 
                      ? "All local variables are allocated within stack frames shown in the Call Stack. No Heap variables allocated."
                      : "Memory is currently empty. Initialize variables in main to see stack allocation addresses."
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          {simulationSteps.length > 0 && (
            <div className="visualizer-progress-container">
              <div className="visualizer-progress-bar">
                <div 
                  className="visualizer-progress-fill"
                  style={{ width: `${simulationSteps.length > 1 ? (step / (simulationSteps.length - 1)) * 100 : 100}%` }}
                />
              </div>
              <span className="visualizer-step-counter">
                Step {step + 1} / {simulationSteps.length}
              </span>
            </div>
          )}

          {/* Standard Out (Stdout) Console Log Output */}
          <div className="console-sim-box font-mono">
            {currentStep ? currentStep.console : 'Console idle.'}
          </div>
        </>
      )}
    </div>
  );
};
