TAG = $(shell git describe --abbrev=0 --tags)
IMAGE_TAG = $(TAG:v%=%)
IMAGE_NAME = hojas/fe-stack

image:
	docker build -t $(IMAGE_NAME):latest -t $(IMAGE_NAME):$(IMAGE_TAG) -f Dockerfile .
	docker image prune -f

push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):latest
