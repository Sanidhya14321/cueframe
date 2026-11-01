import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = { searchParams: Promise<{ failed?: string }> };

const LoginPage = async ({ searchParams }: Props) => {
  const { failed } = await searchParams;
  return (
    <form
      action="/api/login"
      method="post"
      className="mx-auto flex w-full max-w-sm flex-col gap-3 px-4 py-24"
    >
      <h1 className="font-display text-3xl">Sign in to ClipKit</h1>
      <label htmlFor="email" className="text-sm">
        Email
      </label>
      <Input id="email" name="email" autoComplete="username" required={true} />
      <label htmlFor="password" className="text-sm">
        Password
      </label>
      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required={true}
      />
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          That password is not correct.
        </p>
      ) : null}
      <Button type="submit">Sign in</Button>
    </form>
  );
};

export default LoginPage;
