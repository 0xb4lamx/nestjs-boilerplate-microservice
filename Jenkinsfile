#!groovy

def skippingText = ""
def commitContainsSkip = 0
def shouldBuild = false
String[] releaseBranches = ["master","pr/rc","develop"]

pipeline {
    agent any
    stages{
        stage('init') {
            steps{
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
        when{
            expression{
                return env.shouldBuild != "false"
            }
        }
        steps{
            script{
                if(releaseBranches.contains(${env.BRANCH_NAME})){
                    withCredentials([string(credentialsId: '', variable: 'GH_TOKEN')]){ 
                        sh 'npm run release'
                    }
                }
            }
        }
    }
}