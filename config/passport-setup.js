const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

const fetch = require( "node-fetch" );

// const keys = require('../.env');

passport.use( 
  new GoogleStrategy({
  // options for strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  }, async (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log('passport callback function fired');
    console.log(profile);  
    const id = profile.id;
    const name = profile.displayName;
    const res = await hasuraRequest( INSERT, { objects: [{ id: id, email: name }]});  
    console.log(res);
    console.log(accessToken);
    
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
        on_conflict: { constraint: users_pkey, update_columns: email }
    ) {
        returning { id }
    }
}`;