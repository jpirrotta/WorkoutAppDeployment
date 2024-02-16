# What is this for?

This Repo was created for the purpose of acting as the deploymeent repository for our website on Vercel.

# How does it work?
In our main repository, rather than having a folder which contains all of the files for our website (the nextjs project), we have this sub repo. This sub repo contains the next project, and when the next project is changed here, we are able to pull those changes into the main repository. This allows us to keep track of the Next Project in our main repo which has all of our project management files, but it keeps the deployment repo seperate. 

# Why did we do this?
We did this because Vercel does not allow hosting from organization repos on its free tier. 
