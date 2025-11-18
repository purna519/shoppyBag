import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/">
          <h1 className="text-2xl font-bold">ShoppyBag</h1>
        </Link>
        <nav className="flex gap-4 items-center">
          <Link to="/cart">Cart</Link>
          {token ? (
            <button onClick={logout} className="text-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
