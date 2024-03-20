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

# install kubectl
az aks install-cli

az aks get-credentials --resource-group FlashCastEvaluation --name flashcast_k8s
