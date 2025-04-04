resource "oci_containerengine_cluster" "mtdrworkshop_cluster" {
  compartment_id = var.ociCompartmentOcid

  endpoint_config {
    is_public_ip_enabled = "true"
    nsg_ids              = []
    subnet_id            = oci_core_subnet.endpoint.id
  }

  kubernetes_version = "v1.32.1"
  name               = "mtdrworkshopcluster-${var.mtdrKey}"
  vcn_id             = oci_core_vcn.okevcn.id

  options {
    service_lb_subnet_ids = [oci_core_subnet.svclb_Subnet.id]

    add_ons {
      is_kubernetes_dashboard_enabled = "false"
      is_tiller_enabled               = "false"
    }

    admission_controller_options {
      is_pod_security_policy_enabled = "false"
    }

    kubernetes_network_config {
      pods_cidr     = "10.244.0.0/16"
      services_cidr = "10.96.0.0/16"
    }
  }
}

resource "oci_containerengine_node_pool" "oke_node_pool" {
  cluster_id         = oci_containerengine_cluster.mtdrworkshop_cluster.id
  compartment_id     = var.ociCompartmentOcid
  kubernetes_version = "v1.32.1"
  name               = "Pool"
  node_shape         = "VM.Standard2.2"

  node_config_details {
    placement_configs {
      availability_domain = data.oci_identity_availability_domain.ad1.name
      subnet_id           = oci_core_subnet.nodePool_Subnet.id
    }

    size = "3"
  }

  node_source_details {
    source_type = "IMAGE"
    image_id    = "ocid1.image.oc1.mx-queretaro-1.aaaaaaaamuoj2eeqgd2pmrz5rx4y23ggxbjyvb7t4m7vlvrv2huyljz7dytq" # Oracle Autonomous Linux 7.9 (x86)
  }

  // Puedes activar esto si necesitas acceso por SSH
  // ssh_public_key = var.node_pool_ssh_public_key
}

data "oci_containerengine_cluster_option" "mtdrworkshop_cluster_option" {
  cluster_option_id = "all"
}

data "oci_containerengine_node_pool_option" "mtdrworkshop_node_pool_option" {
  node_pool_option_id = "all"
}
