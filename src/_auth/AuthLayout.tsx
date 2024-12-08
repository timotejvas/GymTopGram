import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-col py-10 w-full h-full justify-center items-center">
            <Outlet />
          </section>

          <img
            src="public\assets\images\gymnaziumlogin.png"
            alt="logo"
            className="hidden xl:block h-screen w-[60%] object-cover bg-no-repeat object-left-top"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
