import {Injectable} from '@nestjs/common';
import puppeteer from "puppeteer";
import {OutputFormat} from "../common/types/output-format.type";
import lodash from "lodash";

@Injectable()
export class FileHandlerService {
    constructor() {}
    private async generateDownloadData(file: Buffer, format: OutputFormat, name: string, isReport: boolean) {
        const filename = lodash.snakeCase(name) + `_${!isReport ? 'solution' : 'report'}.${format}`;
        const contentType = `${format !== 'pdf' ? 'image' : 'application'}/${format}`;
        const headers = {
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Content-Type': contentType,
            'Content-Disposition': `filename="${filename}"`,
        };

        return {
            file,
            headers,
        };
    }

    async createFile(htmlContent: string, format: OutputFormat, problemName: string) {
        const browser = await puppeteer.launch({
            headless: "new",
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent);
        await page.emulateMediaType('screen');

        let file: Buffer;
        if (format === 'pdf') {
            file = await page.pdf({ format: 'A4' });
        } else {
            const screenshotOptions = {
                type: format,
                fullPage: true,
            };
            file = await page.screenshot(screenshotOptions);
        }

        await browser.close();

        return await this.generateDownloadData(file, format, problemName, false);
    }

    async createReport(htmlContents: string[], userName: string) {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        let completeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        iframe {
          width: 100%;
          height: calc(100vh - 20px);
          border: none;
          margin: 0;
          padding: 0;
          display: block;
        }
        .page-break {
          page-break-after: always;
          height: 0;
          display: none;
        }
      </style>
      <title>Result</title>
    </head>
    <body>`;

        for (const [_, content] of htmlContents.entries()) {
            const blob = Buffer.from(content).toString('base64');
            completeHtml += `<iframe src="data:text/html;base64,${blob}"></iframe>`;
        }

        completeHtml += '</body></html>';

        await page.setContent(completeHtml, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen');


        const file = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' }
        });

        await browser.close();

        return await this.generateDownloadData(file, OutputFormat.PDF, userName, true);
    }

}
