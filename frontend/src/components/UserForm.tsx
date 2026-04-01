import Button from "./Button";

export default function UserForm() {
  return (
    <form action="/users" method="POST" className="flex flex-col gap-4 mt-4">
      <input type="email" placeholder="E-mail do usuário" name="username" />
      <input type="password" placeholder="Senha do usuário" name="password" />
      <Button text="Save" type="submit" />
    </form>
  );
}