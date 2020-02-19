import React from 'react';
import $ from "jquery";

export default ({title = 'Data', label = '', onDelete = () => {}}) => {
    const modal = $("#modal-delete");
    return (
        <div className="modal fade" id="modal-delete" tabIndex="-1" role="dialog" aria-labelledby="modalDelete" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalDelete">
                            Delete <span className="delete-title">{title}</span>
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="lead mb-0">
                            Are you sure want to delete <span className="font-weight-bold delete-label">{label}</span>?
                        </p>
                        <small className="text-muted">
                            All related data will be deleted and this action might be irreversible.
                        </small>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-danger btn-sm" data-dismiss="modal">
                            CLOSE
                        </button>
                        <button type="submit" className="btn btn-danger btn-sm" onClick={() => onDelete(modal)}>
                            DELETE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
