import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const interpolate = (html: string, data: any) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder: string) => {
    return data[placeholder] || "";
  });
};
const formatNotes = (notes: Note[]) => {
  return notes
    .map((note) => {
      return `
      <div class="note">
        <p>${note.content}</p>
        <div class="tags">
          ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    `;
    })
    .join("\n");
};

const createServer = (notes: Note[]) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = path.join(__dirname, "./", "template.html");
    const template: string = await fs.readFile(HTML_PATH, "utf-8");
    const html = interpolate(template, { notes: formatNotes(notes) });

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
};

export const start = (notes: Note[], port: number) => {
  const server = createServer(notes);
  server.listen(port, () => {
    const address = `http://localhost:${port}`;
    console.log("server running on ", address);
  });
};
