import Player from "@/app/players/addPlayer/page";
import AddTransaction from "@/app/transaction/addTransaction/page";

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
        AddTransaction: "/transaction/addTransaction",
        TransactionHistory: "/transaction/transactionHistory",
        Transactions: "/transaction",
    }
}