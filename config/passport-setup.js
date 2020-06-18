const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

const fetch = require( "node-fetch" );

// const keys = require('../.env');

passport.serializeUser((user, done) => {
  console.log('serial', user);
  
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = hasuraRequest(CHECK, {id}).then((user) => {
    done(null, user);
  });

  
});


passport.use( 
  new GoogleStrategy({
  // options for strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  }, async (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log('passport callback function fired');
    const id = profile.id;
    const name = profile.displayName;
    
    // check if user already exists in db
    const currentUser = await hasuraRequest(CHECK, {id});
    if (currentUser.data.users_by_pk) {
      console.log('user exists');

      done(null, currentUser.data.users_by_pk)

    } else {
      // create new user if one isn't found
      const createUser = await hasuraRequest( INSERT, { objects: { id: id, username: name }}).then((newUser) => {
        console.log('new user', newUser.data.insert_users.returning[0]);
        done(null, newUser.data.insert_users.returning[0])
      });
      
    }  
    })
);



const hasuraRequest = async ( query, variables ) => {
	const response = await fetch( "https://hasuraql-pf.herokuapp.com/v1/graphql", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"X-Hasura-Admin-Secret": process.env.HASURA_SECRET,
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});
	return await response.json();
};

const INSERT = `
mutation insertUser ( $objects: [users_insert_input!]! ) {
    insert_users ( 
        objects: $objects, 
        on_conflict: { constraint: users_pkey, update_columns: username }
    ) {
        returning { id, username }
    }
}`;

const CHECK = `
query MyQuery ($id: String!){
  users_by_pk(id: $id) {
    id
    username
  }
}`;

// const CHECK = `
// query MyQuery ($id: String!){ 
//   users(where: {id: {_eq: $id}}) {
//     id
//     username
//   }
// }`;