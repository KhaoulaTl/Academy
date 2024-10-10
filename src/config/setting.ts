import Player from "@/app/players/addPlayer/page";

export const setting = {
    roles: {
        admin: "admin",
    },
    routes: {
        Home: "/",
        SignIn : "/auth/signin",
        SignUp : "/auth/signup",
        Profile : "/profile",
        AddCoach : "/coachs/addCoach",
        UpdateCoach: "/coachs/updateCoach",
        Coachs : "/coachs",
        Category : "/category",
        AddParent: "parents/addParent",
        Parents: "/parents",
        AddPlayer: "/players/addPlayer",
        Players: "/players",
    }
}