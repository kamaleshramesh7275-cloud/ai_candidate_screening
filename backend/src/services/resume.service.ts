import { PDFParse } from 'pdf-parse';

export const parseResume = async (buffer: Buffer): Promise<string> => {
  try {
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return '';
  }
};
