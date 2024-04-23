```bash
az login
az account set --subscription CallingAndMeetingTest
az provider register --namespace Microsoft.ContainerRegistry
# create resource group
az group create --name FlashCastEvaluation --location westus
# create vnet
az network vnet create --name flashcast_vnet --resource-group FlashCastEvaluation --location westus --address-prefix "10.0.0.0/16" --subnet-name default --subnet-prefix "10.0.1.0/24"
# create acr
az acr create --name flashcasteval --resource-group FlashCastEvaluation --sku Premium --location westus
# https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/062c3243-3c1a-4647-a71f-35ce706bf8b2/resourceGroups/FlashCastEvaluation/providers/Microsoft.ContainerRegistry/registries/flashcasteval/quickStart
# push image to acr, ensure docker is running
az acr login --name flashcasteval
# For this example, you will pull a public "hello world" image locally and provide a tag before you push the image to your registry.
# docker pull mcr.microsoft.com/mcr/hello-world
# docker tag mcr.microsoft.com/mcr/hello-world flashcasteval/samples/hello-world
# # Now that you've tagged the "hello world" image with the fully qualfied path to your private registry, you can push it to the registry with docker push
# docker push flashcasteval/samples/hello-world

# create storage
az storage account create --name flashcaststorage --resource-group FlashCastEvaluation --location westus --sku Standard_LRS --kind StorageV2
# list storage keys
az storage account keys list --account-name flashcaststorage --resource-group FlashCastEvaluation --output table

# create a vm with ubuntu
az vm create --resource-group FlashCastEvaluation --name flashcastvm --image Ubuntu2204 --admin-username flashcast --generate-ssh-keys --vnet-name flashcast_vnet --subnet default
# ssh flashcast@<vm-public-ip>
# sudo apt-get update
# sudo apt install docker.io -y
# sudo docker run -it hello-world
# curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

az aks create --resource-group FlashCastEvaluation --name FlashCastK8s --enable-addons monitoring,http_application_routing --kubernetes-version "1.28.5" --generate-ssh-keys --node-count 1 --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --enable-cluster-autoscaler --min-count 1 --max-count 5 --location westus
# install kubectl
az aks install-cli

az aks get-credentials --resource-group FlashCastEvaluation --name FlashCastK8s

# build and push image
docker compose -f ./deploy/docker-compose.yml build nextapp
docker push flashcasteval.azurecr.io/flashcast-nextapp:v1.2


az network front-door create --resource-group FlashCastEvaluation --name flashcasteval --backend-address "104.42.142.32"

```

Deploy postgresql

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-postgresql bitnami/postgresql --set persistence.size=2Gi
```

Set secret

```bash
kubectl create secret generic nextapp --from-literal=nextauth_secret=qxjhk3udgujkhhyweokc92742-giuhjgk --from-literal=app_host=https://flashcasteval.azurefd.net --from-literal=azure_ad_tenant_id=[replace with true value] --from-literal=azure_ad_client_id=[replace with true value] --from-literal=azure_ad_client_secret=[replace with true value] --from-literal=storage_account=[replace with true value] --from-literal=storage_account_key=[replace with true value]
```

Redeploy k8s deployment

```bash
 kubectl rollout restart deployment.apps/flashcast-nextapp
```
