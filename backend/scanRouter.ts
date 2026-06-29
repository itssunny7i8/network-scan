import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { MockScanService } from './scanService';

const scanRouter = Router();
const scanService = new MockScanService();

// Validation schema for scan request
const scanRequestSchema = z.object({
  target: z.string()
    .min(1, 'Target is required')
    .max(100, 'Target too long')
    .refine((val) => {
      // Validate that the target matches a hostname or IP address format
      // Deny spaces, semicolons, shell execution characters to prevent command injection
      const targetRegex = /^[a-zA-Z0-9.-]+$/;
      return targetRegex.test(val);
    }, {
      message: 'Invalid target format. Only IP addresses (e.g., 192.168.1.1) and domain names (e.g., local-vm.lan) are permitted. No shell characters or spaces allowed.'
    }),
  scanType: z.enum(['quick', 'service', 'os', 'aggressive', 'udp'], {
    errorMap: () => ({ message: 'Scan type must be one of: quick, service, os, aggressive, udp' })
  })
});

// Post route to trigger simulated scan
scanRouter.post('/scan', async (req: Request, res: Response) => {
  try {
    // 1. Validate inputs using Zod
    const validation = scanRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors[0].message
      });
    }

    const { target, scanType } = validation.data;

    // 2. Perform simulated Nmap scan
    const results = await scanService.executeScan(target, scanType);

    // 3. Return JSON response
    return res.status(200).json({
      success: true,
      data: results
    });

  } catch (error: any) {
    console.error('Scan Error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while conducting the network scan simulation.'
    });
  }
});

export default scanRouter;
