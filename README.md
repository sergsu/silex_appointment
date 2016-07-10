= Deployment =

First, build the image:
> docker build - < Dockerfile

Then you can run a container (note that you should use your real folder in volume mapping):
> docker create --name silex-appointment -p 8008:80 -v /path/to/project/:/var/www/ silex-appointment

And then just run the the container:
> docker run silex-appointment

When it is done, just run composer install.