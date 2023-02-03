import uuid

from flask import request, Blueprint, render_template

from .checks import require_oauth2
from .client import oauth2_get, oauth2_post
from .request_utils import request_error, process_error

resources = Blueprint("resource", __name__)

@resources.route("/", methods=["GET"])
@require_oauth2
def user_resources():
    """List the resources the user has access to."""
    def __success__(resources):
        return render_template("oauth2/resources.html", resources=resources)

    return oauth2_get("oauth2/user/resources").either(
        request_error, __success__)

@resources.route("/create", methods=["GET", "POST"])
@require_oauth2
def create_resource():
    """Create a new resource."""
    def __render_template__(categories=[], error=None):
        return render_template(
            "oauth2/create-resource.html",
            resource_categories=categories,
            resource_category_error=error)

    if request.method == "GET":
        return oauth2_get("oauth2/resource/categories").either(
            lambda error: __render_template__(error=process_error(
                error, "Could not retrieve resource categories")),
            lambda cats: __render_template__(categories=cats))

    from flask import jsonify
    def __perr__(error):
        print(f"ERROR: {process_error(error)}")
        return jsonify(process_error(error))
    def __psuc__(succ):
        print(f"SUCCESS: {succ.json()}")
        return jsonify(succ.json())
    return oauth2_post(
        "oauth2/resource/create", data=request.form).either(
            __perr__, __psuc__)

@resources.route("/view/<uuid:resource_id>", methods=["GET"])
@require_oauth2
def view_resource(resource_id: uuid.UUID):
    """View the given resource."""
    # Display the resource's details
    # Provide edit/delete options
    # Metadata edit maybe?
    return "WOULD DISPLAY THE GIVEN RESOURCE'S DETAILS"

@resources.route("/edit/<uuid:resource_id>", methods=["GET"])
@require_oauth2
def edit_resource(resource_id: uuid.UUID):
    """Edit the given resource."""
    return "WOULD Edit THE GIVEN RESOURCE'S DETAILS"

@resources.route("/delete/<uuid:resource_id>", methods=["GET"])
@require_oauth2
def delete_resource(resource_id: uuid.UUID):
    """Delete the given resource."""
    return "WOULD DELETE THE GIVEN RESOURCE"
