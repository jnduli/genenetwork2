/**
 * Check whether `dataset` is in array of `datasets`.
 * @param {mRNADataset} A mrna dataset.
 * @param {Array} An array of mrna datasets.
 */
function in_array(dataset, datasets) {
    found = datasets.filter(function(dst) {
	return (dst.SpeciesId == dataset.SpeciesId &&
		dst.InbredSetId == dataset.InbredSetId &&
		dst.ProbeFreezeId == dataset.ProbeFreezeId &&
		dst.ProbeSetFreezeId == dataset.ProbeSetFreezeId);
    });
    return found.length > 0;
}

function toggle_link_button() {
    num_groups = $("#frm-link select option").length - 1;
    num_selected = JSON.parse(
	$("#tbl-link").attr("data-datasets")).length;
    if(num_groups > 0 && num_selected > 0) {
	$("#frm-link input[type='submit']").prop("disabled", false);
    } else {
	$("#frm-link input[type='submit']").prop("disabled", true);
    }
}

function search_mrna() {
    query = document.getElementById("txt-query").value;
    selected = JSON.parse(document.getElementById(
	"tbl-link").getAttribute("data-datasets"));
    species_name = document.getElementById("txt-species-name").value
    search_endpoint = "/oauth2/data/mrna/search"
    search_table = new TableDataSource(
	"#tbl-search", "data-datasets", search_checkbox);
    $.ajax(
	search_endpoint,
	{
	    "method": "POST",
	    "contentType": "application/json; charset=utf-8",
	    "dataType": "json",
	    "data": JSON.stringify({
		"query": query,
		"selected": selected,
		"dataset_type": "mrna",
		"species_name": species_name}),
	    "error": function(jqXHR, textStatus, errorThrown) {
		error_data = jqXHR.responseJSON
		console.debug("ERROR_DATA:", error_data);
		elt = document.getElementById("search-error").setAttribute(
		    "style", "display: block;");
		document.getElementById("search-error-text").innerHTML = (
		    error_data.error + " (" + error_data.status_code + "): " +
			error_data.error_description);
		document.getElementById("tbl-search").setAttribute(
		    "data-datasets", JSON.stringify([]));
		render_table(search_table);
	    },
	    "success": function(data, textStatus, jqXHR) {
		document.getElementById("search-error").setAttribute(
		    "style", "display: none;");
		document.getElementById("tbl-search").setAttribute(
		    "data-datasets", JSON.stringify(data));
		render_table(search_table);
	    }
	});
}

$(document).ready(function() {
    let search_table = new TableDataSource(
	"#tbl-search", "data-datasets", search_checkbox);
    let link_table = new TableDataSource(
	"#tbl-link", "data-datasets", link_checkbox);

    $("#frm-search").submit(function(event) {
	event.preventDefault();
	return false;
    });

    $("#txt-query").keyup(debounce(search_mrna));

    $("#tbl-search").on("change", ".checkbox-search", function(event) {
        if(this.checked) {
	    select_deselect_dataset(
		JSON.parse(this.value), search_table, link_table);
	    toggle_link_button();
        }
    });

    $("#tbl-link").on("change", ".checkbox-selected", function(event) {
	if(!this.checked) {
	    select_deselect_dataset(
		JSON.parse(this.value), link_table, search_table);
	    toggle_link_button();
	}
    });
});
