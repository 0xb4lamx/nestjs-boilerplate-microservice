#!groovy

def skippingText = ""
def commitContainsSkip = 0
def shouldBuild = false
def imageTag = ""
def name = "itninjahue/box"
String[] releaseBranches = ["master","pr/rc","develop"]

pipeline {
    agent any
    stages{
        stage('init') {
            steps{
                script{
                    commitContainsSkip = sh(script: "git log -1 | grep '.*\\[skip ci\\].*'", returnStatus: true)
                    if(commitContainsSkip == 0) {
                        skippingText = "Skipping commit."
                        env.shouldBuild = false
                        currentBuild.result = "NOT_BUILT"
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
                        withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'GH_TOKEN')]){ 
                            sh 'make makefile deliver_image_to_dockerhub'
                        }   
                    }
                    
                }
            }
        }
        
    }
}