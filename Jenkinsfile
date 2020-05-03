#!groovy

def lastCommitInfo = ""
def skippingText = ""
def commitContainsSkip = 0
def shouldBuild = false
def tag = ""
String[] releaseBranches = ["master","pre/rc","develop"]

// ---- infrastructure repository params ----
def infrastructure_environment_folder = ""

pipeline {
    agent any
    environment {
        // ---- microservice repository params ----
        microservice_repository = "nestjs-boilerplate-microservice"
        microservice_organization = "0xb4lamx"
        // ---- infrastructure repository params ----
        infrastructure_organization = "itninja-hue"
        infrastructure_repository = "nestjs-k8s-boilerplate-microservice"
        // ---- docker hub params ----
        dockerhub_organization = 'itninja-hue'
        dockerhub_repository = 'nestjs-boilerplate-microservice'
    }
    stages{
        stage('init') {
            steps{
                script{
                    lastCommitInfo = sh(script: "git log -1 --pretty=medium", returnStdout: true).trim()
                    commitContainsSkip = sh(script: "git log -1 | grep '.*\\[skip ci\\].*'", returnStatus: true)
                    if(commitContainsSkip == 0) {
                        skippingText = "Skipping commit."
                        env.shouldBuild = false
                        currentBuild.result = "NOT_BUILT"
                    }
                }
            }
        }
        stage ('send info to slack'){
            when {
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        slackSend color: "#2222FF", message:"*${env.JOB_NAME}* received a new commit. :hourglass_flowing_sand:"
                    }
                }
            }
        }
        stage ('sending commit info'){
            when {
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        slackSend color: "#2222FF", message:"${skippingText}\n *commmit info:* \n ${lastCommitInfo}"
                        slackSend color: "#2222FF", message:"Releasing on GIT"
                    }
                }
            }
        }
        stage('Git release'){
            agent{
                docker {image 'timbru31/node-alpine-git'}
            }
            environment {
                 HOME = '.'
            }
            when{
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'GH_TOKEN')]){
                            sh 'npm run release'
                        }
                    }
                }
            }
        }
        stage ('Releasing Docker Image'){
            when{
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        slackSend color: "#2222FF", message: "Releasing Image to DockerHub :whale:"
                        withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'GH_TOKEN')]){
                            env.tag = sh (returnStdout: true, script: "make retrivetag organization=${microservice_organization} repository=${microservice_repository}")
                            sh 'make makefile deliver_image_to_dockerhub NAME="${dockerhub_organization}/${dockerhub_repository}" organization=${microservice_organization} repository=${microservice_repository}'
                        }
                        slackSend color: "good", message: "Image released \n *Tag :* ${env.tag}"
                    }

                }
            }
        }
        stage ('infrastructure version update'){
            when{
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        slackSend color: "#2222FF", message: "Updating tag in infrastructure repository"
                        switch(env.BRANCH_NAME) {
                            case "develop":
                                env.infrastructure_environment_folder = "dev"
                            break
                            case "pre/rc":
                                env.infrastructure_environment_folder = "preprod"
                            break
                            case "master":
                                env.infrastructure_environment_folder = "prod"
                            break
                        }
                        withCredentials([usernamePassword(credentialsId: 'sysadmin', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]){
                            sh 'git clone http://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${infrastructure_organization}/${infrastructure_repository}.git'
                            sh 'cd ${infrastructure_repository}; sed -i "s/v[0-9]*\\.[0-9]*\\.[0-9]*.*/${tag}/g" ${infrastructure_environment_folder}/values.yaml'
                            sh 'cd ${infrastructure_repository}; git add ${infrastructure_environment_folder}/values.yaml'
                            sh 'cd ${infrastructure_repository}; git commit -m "update tag" && git push http://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${infrastructure_organization}/${infrastructure_repository}.git || :'
                            sh 'rm -rf ${infrastructure_repository}'
                        }
                        slackSend color: "good", message: "Tag updated succesfully trigering infratsructure pipeline"
                    }
                }
            }
        }
    }
    post {
        always {
            /* clean up workspace */
            deleteDir();
        }
        success {
            script{
                if(releaseBranches.contains(env.BRANCH_NAME)){
                    slackSend color: "good", message: "*${env.JOB_NAME}* Build #${env.BUILD_NUMBER} job is completed successfully \n <${env.BUILD_URL}|Job Link>"
                }
            }
        }
        unstable{
            script{
                if(releaseBranches.contains(env.BRANCH_NAME)){
                    slackSend color: "danger", message: "*${env.JOB_NAME}* Build #${env.BUILD_NUMBER} job is unstable :ghost: \n <${env.BUILD_URL}|Job Link>"
                }
            }
        }
        failure{
            script{
                if(releaseBranches.contains(env.BRANCH_NAME)){
                    slackSend color: "danger", message: "*${env.JOB_NAME}* Build #${env.BUILD_NUMBER} job failed :scream_cat: \n <${env.BUILD_URL}|Job Link>"
                }
            }
        }
    }
}
