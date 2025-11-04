import { PDFDownloadLink } from "@react-pdf/renderer";
import { renderToStream } from "@react-pdf/renderer";
import ResumeTemplate from "../../components/ResumeTemplate";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { resumeData } = req.body;

      const pdfStream = await renderToStream(<ResumeTemplate data={resumeData} />);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

      pdfStream.pipe(res);
      pdfStream.end();
    } catch (error) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
