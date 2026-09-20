import {
  Component,
  afterNextRender,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';

import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [],
  templateUrl: './qr-code.html',
  styleUrl: './qr-code.scss'
})
export class QrCode {
  @ViewChild('qrCanvas')
  qrCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly websiteUrl =
    'https://lgmi-35th-anniversary.netlify.app/';

  constructor() {
    afterNextRender(() => {
      this.generateQrCode();
    });
  }

  private async generateQrCode(): Promise<void> {
    try {
      await QRCode.toCanvas(
        this.qrCanvas.nativeElement,
        this.websiteUrl,
        {
          width: 240,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#0b2742',
            light: '#ffffff'
          }
        }
      );
    } catch (error) {
      console.error('Unable to generate QR code:', error);
    }
  }
}