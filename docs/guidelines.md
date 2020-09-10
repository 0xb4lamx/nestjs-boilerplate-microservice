# Guidelines

This document will introduce concepts and guidelines that constitute software development and delivery culture at box2home.

# Software Versioning and Release 

### Semantic Versioning

We follow the [**Semantic Versioning**](https://semver.org/#summary]) scheme.
> set of rules and requirements that dictate how version numbers are assigned and incremented. These rules are based on but not necessarily limited to pre-existing widespread common practices in use in both closed and open-source software... Under this scheme, version numbers and the way they change convey meaning about the underlying code and what has been modified from one version to the next.

Reading the semantic versioning docs more than once will get you a solid understanding on how we version and tag our software releases. 

### Semantic Release

We use **[semantic-release](https://github.com/semantic-release/semantic-release)** to manage and automate complex release workflows.
>**semantic-release** automates the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.
This removes the immediate connection between human emotions and version numbers, strictly following the [Semantic Versioning](http://semver.org/) specification.

As a SWE you will not be versioning nor releasing manually software, as everything is automated. But a solid insight on how we do things will make your vision and sense of understanding match your teammate's.
# Git workflow

### Git commits convention
We follow **[Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)**.
>The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.

A script is provided that generates commit messages compliant with the conventional commits specification. 
As a SWE, you won't have to remember all types nor the exact syntax rather you will be following what is described in the following scenario.
In a typical work scenario you will be :
```bash
#adding files with
git add file.x
#generate convinient commit message
npm run commit
#follow the instructions
#pushing changes
git push file.x
```
As we provided shortcuts, and easiness , always remember that with such easiness comes great responsibility, use your commit messages wisely as it will impact how your software is versioned and released.
### Git Branching Model
As branching model we follow **GitFlow**  illustrated as follow.

 ![Gitflow diagram](https://i1.wp.com/lanziani.com/slides/gitflow/images/gitflow_1.png)
 
|Branch | Number |Branch|life time|function
|--|--|--|--|--|
| Master | unique |---|permanent| Code stable, tested and validated, production ready
|Feature |many|develop|feature development|Code under development that implements a feature to be embedded in the next version of the application|
|Develop|unique|master|permanent|Once the development of a feature is finished, the code is merged on this branch|
|Release|unique|develop|temporary|Branch on which we will correct the bugs detected during the recipe phase|
|hotfix|None/many|master|bug fix|Branch where bug fixes are done on the code present on the master branch (production)|

#### Branch Naming Convention
* **Feature Branch**
	* **Syntax**
		 ``feature-[JiraTicketNumber] Example: feature-BGP-1368``
* **Develop Branch**
	* **Syntax**
	``develop``
* **Release Branch**
	* **Syntax**
	``pre/rc``
* **Master Branch**
	* **Syntax**
	``master``
