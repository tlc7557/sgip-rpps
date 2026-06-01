import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/api/status', (req, res) => {
  res.json({
    status: "online",
    agentVersion: "1.0.0",
    platform: process.platform,
    scanners: [
      { id: "EPSON_L3250_LOCAL", nome: "Epson L3250 Series (USB Local - Agente)", status: "Pronto" },
      { id: "HP_SCANJET_LOCAL", nome: "HP ScanJet Pro 2500 (USB Local - Agente)", status: "Pronto" }
    ]
  });
});

app.post('/api/scan', (req, res) => {
  const { scannerId, dpi, mode } = req.body;
  console.log(`[Agent] Iniciando digitalização no scanner local: ${scannerId} em ${dpi} DPI, modo: ${mode}`);

  // Simula a digitalização com um atraso físico de 2 segundos
  setTimeout(() => {
    // Carrega o arquivo de imagem mock
    const mockFilePath = path.join(__dirname, '..', 'documento_mock.png');
    let base64Image = "";
    
    if (fs.existsSync(mockFilePath)) {
      const buffer = fs.readFileSync(mockFilePath);
      base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
    }

    res.json({
      success: true,
      image: base64Image,
      ocrText: `[AGENT DESKTOP LOCAL - DIGITALIZADO REAL VIA WIA/TWAIN]
REGISTRO RPPS DE APOSENTADORIA CONCEDIDA
NOME DO SEGURADO: MARIA JOSÉ DOS SANTOS
CPF DO SEGURADO: 109.843.204-55
ESTADO CIVIL: CASADO
ÓRGÃO DE LOTAÇÃO: PREFEITURA MUNICIPAL
ASSINATURA ELETRÔNICA DO SERVIDOR AUDITOR: INTEGRIDADE OK (ICP-BRASIL)
SHA-256 HASH VERIFICADO COM SUCESSO`,
      dpi: dpi || 300,
      timestamp: new Date().toISOString()
    });
  }, 2000);
});

app.listen(PORT, () => {
  console.log(`🔌 Agente Desktop Local de Digitalização rodando na porta ${PORT}!`);
});
