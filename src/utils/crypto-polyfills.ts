import { Buffer } from 'buffer';
import process from 'process';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.process = process;
  
  // Add global Buffer
  if (typeof global === 'undefined') {
    (window as any).global = window;
  }
  global.Buffer = Buffer;
}