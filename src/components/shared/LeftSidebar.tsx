import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { INavLink } from "@/types";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect } from "react";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to={"/"} className="flex gap-3 items-center">
          <img src="/assets/images/logo-topbar.png" alt="logo" width={60} />
          <h1 className="h3-bold md:h2-bold">GymTopGram</h1>
        </Link>

        <div className="flex items-center gap-5">
          <img
            src={user.imageUrl || "assets/images.profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            // CHECKING IF CATEGORY IS ACTIVE
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link ${
                  isActive && "bg-primary-500"
                } group`}
              >
                <NavLink
                  className="flex gap-4 itmes-center p-4"
                  to={link.route}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Odhlásiť sa</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
