import { NavLink, useNavigate } from "react-router-dom";

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="navbar-default navbar navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <NavLink className="navbar-brand" to="/">Mekanbul</NavLink>
          <button
            className="navbar-toggle"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-main"
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>

        <div id="navbar-main" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li>
              <NavLink to={"about"}>Hakkında</NavLink>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            {user ? (
              <>
                {user.role === "admin" && (
                  <li><NavLink to="/admin">Yönetici Paneli</NavLink></li>
                )}
                <li><span onClick={handleLogout} style={{ cursor: "pointer", padding: "15px", display: "block", color: "#777" }}>Çıkış Yap</span></li>
              </>
            ) : (
              <li><NavLink to="/login">Giriş Yap</NavLink></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
