= Deployment =

First, build the image:
> docker build - < Dockerfile

Then you can run a container (image-id is the ID Docker has given you in previous command):
> docker create --name silex-booking -p 8008:80 -v /path/to/project/:/var/www/ silex-booking

And then just run the the container:
> docker run silex-booking