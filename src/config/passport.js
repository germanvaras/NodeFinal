const passport = require("passport");
const GitHubStrategy = require("passport-github2");
const {
    createUserService,
    getUserByEmail,
} = require("../services/user");

const initPassport = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
    
        const user = await getUserById(id);
        done(null, user);
    });
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: process.env.githubClientId,
                clientSecret: process.env.githubSecret,
                callbackUrl: process.env.githubCallBack,
                
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await getUserByEmail(profile.emails[0].value)
                    if (!user) {
                        let newUser = {
                            name: profile._json.login,
                            lastname:"",
                            username: profile._json.login,
                            email: profile.emails[0].value,
                            password: "",
                        };
                        let userAdded = await createUserService(newUser);
                        done(null, userAdded);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

module.exports = initPassport;
