# TAG = $(shell git describe --abbrev=0 --tags)
TAG = v1.0.0
IMAGE_TAG = $(TAG:v%=%)
IMAGE_NAME = hojas/fe-stack

image:
	docker buildx build -t $(IMAGE_NAME):latest -t $(IMAGE_NAME):$(IMAGE_TAG) --platform linux/amd64,linux/arm64 . --push
	docker image prune -f

push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):latest
