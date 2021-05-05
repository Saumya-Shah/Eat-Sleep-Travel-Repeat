# Eat-Sleep-Travel-Repeat

Based on the passion and demand to travel and enjoy delicious food post pandemic, our team has decided to implement a Web Application that recommends restaurants/places for users based on their favorites, geolocation, personal habit and word-of-mouth rating. The project is to design a web application based on two dataset: Yelp restaurant dataset and Airlines within the United states. We intend to deliver a convenient way for users to choose and plan where to go and what to eat. 

This is a class project for CIS 550.

Contributors: Megha Mishra, Saumya Shah, Shumin Yuan, Zhuo Chen

### Images

Download res_pics directory from [here](https://drive.google.com/drive/folders/1qmXI027Z-Qr2r-4XdxqtKQI1ZMDp7HEU?usp=sharing) and place it under client/public/ directory for rendering pics.

### HTTPS

The project uses https, and thus, you need to create SSL certificates for localhost. Follow these steps to get the certificates:
1. Install mkcert following the instructions [here](https://github.com/FiloSottile/mkcert#installation) 
2. Go to the project root directory and run the following commands to generate the certificate and key.
3. `mkcert -install`
4. `mkcert -cert-file ./cert.pem -key-file ./key.pem localhost`

### Database 

Install oracle db as per the instructions here: http://oracle.github.io/node-oracledb/INSTALL.html

### Running the project

Run `npm install` from client and server directory.

Run `npm start` from client and server directory.


*note: for Mac users(Catalina and above), please add this line below into "scripts" of package.json file under the server folder:

"postinstall": "ln -s $HOME/Downloads/instantclient_19_8/libclntsh.dylib $(npm root)/oracledb/build/Release",
