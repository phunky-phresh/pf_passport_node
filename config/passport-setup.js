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
    const id = profile.id;
    const name = profile.displayName;

    // check if user already exists in db
    const res1 = await hasuraCheckUser(CHECK, {id});
    console.log(res1);
    // const idCheck = res1.data.users_by_pk.id;
    if (!res1.data.users_by_pk) {
      const res = await hasuraRequest( INSERT, { objects: [{ id: id, username: name }]});
      
      console.log('new user', res);
      
    } else {
      console.log('user exists');
      
    }
    
    
    // console.log(res1.data);
    // console.log(res1.data.users);
    

    
    
    })
);

const hasuraCheckUser = async (query, variables) => {
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
}

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
        returning { id }
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