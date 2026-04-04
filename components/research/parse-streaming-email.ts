/**
 * Incrementally parse subject and body from a partial JSON email chunk.
 */
export function parseStreamingEmailFields(accumulated: string): {
  subject: string | null;
  body: string | null;
} {
  let subject: string | null = null;
  let body: string | null = null;

  const subjectMatch = accumulated.match(/"subject"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (subjectMatch) {
    subject = subjectMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }

  const bodyStart = accumulated.match(/"body"\s*:\s*"/);
  if (bodyStart && bodyStart.index !== undefined) {
    const afterBodyKey = accumulated.slice(bodyStart.index + bodyStart[0].length);
    let bodyContent = '';
    let i = 0;
    while (i < afterBodyKey.length) {
      if (afterBodyKey[i] === '\\' && i + 1 < afterBodyKey.length) {
        const next = afterBodyKey[i + 1];
        if (next === 'n') bodyContent += '\n';
        else if (next === '"') bodyContent += '"';
        else if (next === '\\') bodyContent += '\\';
        else bodyContent += next;
        i += 2;
      } else if (afterBodyKey[i] === '"') {
        break;
      } else {
        bodyContent += afterBodyKey[i];
        i++;
      }
    }
    body = bodyContent;
  }

  return { subject, body };
}
