import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to={"/"} className="flex gap-3 items-center">
          <img src="/assets/images/logo-topbar.png" alt="logo" width={60} />
          <h1 className="h3-bold md:h2-bold">GymTopGram</h1>
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <div className="flex-center gap-3">
            <img
              src={user.imageUrl || "assets/images.profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
