
export interface RunResult {
  output: string[];
  error?: string;
}

export const runJS = async (code: string): Promise<RunResult> => {
  const output: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    output.push(args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' '));
  };
  
  console.error = (...args) => {
    output.push('ERROR: ' + args.join(' '));
  };

  try {
    // eslint-disable-next-line no-eval
    eval(code);
    return { output };
  } catch (err: any) {
    return { output, error: err.message };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
};
