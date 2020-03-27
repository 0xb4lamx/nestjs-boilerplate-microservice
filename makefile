deliver_image_to_dockerhub: build cleanup push
TAG	   := $$(curl --silent -H  "Authorization: token ${GH_TOKEN}" "https://api.github.com/repos/${organization}/${repository}/releases" | grep tag_name | head -1 |grep -oP  '(?<=\").*?(?=\")' | cut -d " " -f2 | tail -1 | sed 's/\@/\-/')
IMG    := ${NAME}:${TAG}

retrivetag:
	@echo -n ${TAG}
build:
	@docker build -t ${IMG} .
	
cleanup:
	@docker system prune -f
  
push:
	@docker push ${NAME}