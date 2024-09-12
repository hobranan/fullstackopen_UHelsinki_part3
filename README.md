# fullstackopen_UHelsinki_part3

https://fullstackopen.com/en/part3/node_js_and_express

Exercises 3.1.-3.6.
NB: It's recommended to do all of the exercises from this part into a new dedicated git repository, and place your source code right at the root of the repository. Otherwise, you will run into problems in exercise 3.10.

NB: Because this is not a frontend project and we are not working with React, the application is not created with create vite@latest -- --template react. You initialize this project with the npm init command that was demonstrated earlier in this part of the material.

Strong recommendation: When you are working on backend code, always keep an eye on what's going on in the terminal that is running your application.

npm init
<!-- fill in scripts in package.json -->
npm start

Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.
Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is Express.

nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

ctrl+c
npm install express
npm install --save-dev nodemon
npm update
npm run dev


HTTP request types explained:
GET requests receival of a data package
HEAD requests receival of only a data package's response code and header info
PUT requests changing a db's entry with different info
DELETE requests deleting a db's entry
POST requests adding a db's entry (or whole db set of entries) 
*POST is the type of HTTP request with chance of side effects (i.e. repeated same exact requests may cause a different result)

ctrl+c
npm install morgan
npm update
npm run dev