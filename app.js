const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')


const app = express()
const blogs = []

app.use(bodyParser.json())


app.use('/graphql', graphqlHTTP({
  schema:buildSchema(`
  type Blog {
       _id: ID!
       title: String!
       text: String!
       description: String!
       date: String       
  }
  
  input BlogInput {
       title: String!
       text: String!
       description: String!
       date: String
  }
  
  type blogQuery {
        blogs: [Blog!]!
  }
  
  type blogMutation {
        createBlog(blogInput: BlogInput): Blog
  }
  
  schema {
      query: blogQuery
      mutation: blogMutation
  }
  `),
  rootValue: {
    blogs: () => {
      return blogs
    },
    createBlog: (args) => {
      const blog = {
        _id: '1234',
        title: args.blogInput.title,
        text: args.blogInput.text,
        description: args.blogInput.description,
        date: new Date().toISOString() ,

      }
      blogs.push(blog)
      return blog
    }
  },
  graphiql: true
}))

app.get('/', (req, res, next) => {
  res.send('our server is live')
})

app.listen(5000)
