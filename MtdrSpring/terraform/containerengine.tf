resource "oci_containerengine_cluster" "mtdrworkshop_cluster" {
  compartment_id = var.ociCompartmentOcid
  name           = "mtdrworkshopcluster-${var.mtdrKey}"
  vcn_id         = oci_core_vcn.okevcn.id
  kubernetes_version = "v1.32.1"

  endpoint_config {
    is_public_ip_enabled = true
    nsg_ids              = []
    subnet_id            = oci_core_subnet.endpoint.id
  }

  options {
    service_lb_subnet_ids = [oci_core_subnet.svclb_Subnet.id]

    add_ons {
      is_kubernetes_dashboard_enabled = false
      is_tiller_enabled               = false
    }

    admission_controller_options {
      is_pod_security_policy_enabled = false
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
    size = 3

    placement_configs {
      availability_domain = data.oci_identity_availability_domain.ad1.name
      subnet_id           = oci_core_subnet.nodePool_Subnet.id
    }
  }

  node_source_details {
    image_id    = local.autonomous_linux_image
    source_type = "IMAGE"
  }
}

data "oci_containerengine_cluster_option" "mtdrworkshop_cluster_option" {
  cluster_option_id = "all"
}

data "oci_containerengine_node_pool_option" "mtdrworkshop_node_pool_option" {
  node_pool_option_id = "all"
}

locals {
  # Puedes usar esta forma dinámica si prefieres filtrar entre muchas imágenes
  # all_sources = data.oci_containerengine_node_pool_option.mtdrworkshop_node_pool_option.sources
  # oracle_autonomous_linux_images = [for source in local.all_sources : source.image_id if length(regexall("Autonomous-Linux-[0-9]*\\.[0-9]*", source.source_name)) > 0]

  # Versión directa con la imagen específica (más controlada)
  autonomous_linux_image = "ocid1.image.oc1.mx-queretaro-1.aaaaaaaamuoj2eeqgd2pmrz5rx4y23ggxbjyvb7t4m7vlvrv2huyljz7dytq"
}
