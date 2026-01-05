import { Context } from 'hono';

export const jsonResponse = (
  c: Context,
  status: number,
  data: any,
  message: string
) => {
  return c.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
    },
    status
  );
};
