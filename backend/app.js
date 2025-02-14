import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import graphQLSchema from './graphql/schema/index.js';
import graphQLResolvers from './graphql/resolvers/resolver.js';
import isAuth from './middleware/isAuth.js';


const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.2xn3e3v.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(4000);
    console.log('app listening at: 4000')
  })
  .catch((err) => {
    console.log(err);
  });