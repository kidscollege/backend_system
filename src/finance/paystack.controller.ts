import { Body, Controller, Headers, Post, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { FinanceService } from './finance.service.js';

@Controller('finance/payments/paystack')
export class PaystackController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('webhook')
  async webhook(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
    @Req() request: any,
  ) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const rawBody = request.rawBody as Buffer | undefined;
    if (!secret || !rawBody || !signature) {
      throw new UnauthorizedException('Invalid Paystack webhook configuration');
    }

    const expected = createHmac('sha512', secret).update(rawBody).digest('hex');
    const valid = expected.length === signature.length && timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
    if (!valid) throw new UnauthorizedException('Invalid Paystack webhook signature');

    if (body?.event !== 'charge.success') return { received: true };
    const invoiceId = body.data?.metadata?.invoiceId;
    const reference = body.data?.reference;
    const amountKobo = Number(body.data?.amount);
    if (!invoiceId || !reference || !Number.isFinite(amountKobo)) {
      throw new BadRequestException('Incomplete Paystack charge payload');
    }

    await this.financeService.confirmPaystackPayment({ invoiceId, reference, amountKobo });
    return { received: true };
  }
}