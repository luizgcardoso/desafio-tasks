import Button from "../components/Button";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Login</h1>
      <form action="/login" method="POST" className="flex flex-col gap-4 mt-4">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" text="Sign in" type="submit" />
      </form>
    </div>
  );
}
