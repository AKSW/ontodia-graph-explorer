import * as React from 'react';

import { WorkspaceLanguage } from './workspace';

export interface ToolbarProps {
  canSaveDiagram?: boolean;
  onSaveDiagram?: () => void;
  canPersistChanges?: boolean;
  onPersistChanges?: () => void;
  onForceLayout?: () => void;
  onClearAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomToFit?: () => void;
  onExportSVG?: (fileName?: string) => void;
  onExportPNG?: (fileName?: string) => void;
  onPrint?: () => void;
  onDownloadSource?: () => void;
  onUploadSource?: () => void;
  onReloadClassTree?: () => void;
  languages?: ReadonlyArray<WorkspaceLanguage>;
  selectedLanguage?: string;
  onChangeLanguage?: (language: string) => void;
  hidePanels?: boolean;
}

const CLASS_NAME = 'graph-explorer-toolbar';

export class DefaultToolbar extends React.Component<ToolbarProps, {}> {
  private onChangeLanguage = (
    event: React.SyntheticEvent<HTMLSelectElement>
  ) => {
    const value = event.currentTarget.value;
    this.props.onChangeLanguage(value);
  };

  private onExportSVG = () => {
    this.props.onExportSVG();
  };

  private onExportPNG = () => {
    this.props.onExportPNG();
  };

  private renderSaveDiagramButton() {
    if (!this.props.onSaveDiagram) {
      return null;
    }
    return (
      <button
        type="button"
        className="saveDiagramButton graph-explorer-btn graph-explorer-btn-default"
        disabled={this.props.canSaveDiagram === false}
        onClick={this.props.onSaveDiagram}
      >
        <span className="fa fa-cloud-upload" aria-hidden="true" /> Save diagram
      </button>
    );
  }

  private renderPersistAuthoredChangesButton() {
    if (!this.props.onPersistChanges) {
      return null;
    }
    return (
      <button
        type="button"
        className="saveDiagramButton graph-explorer-btn graph-explorer-btn-success"
        disabled={this.props.canPersistChanges === false}
        onClick={this.props.onPersistChanges}
      >
        <span className="fa fa-floppy-o" aria-hidden="true" /> Save data
      </button>
    );
  }

  private renderLanguages() {
    const { selectedLanguage, languages } = this.props;
    if (languages.length <= 1) {
      return null;
    }

    return (
      <span
        className={`graph-explorer-btn-group ${CLASS_NAME}__language-selector`}
      >
        <label className="graph-explorer-label">
          <span>Data Language - </span>
        </label>
        <select value={selectedLanguage} onChange={this.onChangeLanguage}>
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </span>
    );
  }

  render() {
    return (
      <div className={CLASS_NAME}>
        <div className="graph-explorer-btn-group graph-explorer-btn-group-sm">
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Reload Classes Tree"
            onClick={this.props.onReloadClassTree}
          >
            <span className="fa fa-refresh" aria-hidden="true" /> Classes
          </button>
          <span className="graph-explorer-toolbar__layout-group">
            &nbsp;
          </span>
          {this.renderSaveDiagramButton()}
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Download diagram source"
            onClick={this.props.onDownloadSource}
          >
            <span className="fa fa-download" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Open diagram source"
            onClick={this.props.onUploadSource}
          >
            <span className="fa fa-folder-open-o" aria-hidden="true" />
          </button>
          {this.renderPersistAuthoredChangesButton()}
          {this.props.onClearAll ? (
            <button
              type="button"
              className="graph-explorer-btn graph-explorer-btn-default"
              title="Clear All"
              onClick={this.props.onClearAll}
            >
              <span className="fa fa-trash" aria-hidden="true" />
              &nbsp;Clear All
            </button>
          ) : null}
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Force layout"
            onClick={this.props.onForceLayout}
          >
            <span className="fa fa-sitemap" aria-hidden="true" /> Layout
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Zoom In"
            onClick={this.props.onZoomIn}
          >
            <span className="fa fa-search-plus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Zoom Out"
            onClick={this.props.onZoomOut}
          >
            <span className="fa fa-search-minus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Fit to Screen"
            onClick={this.props.onZoomToFit}
          >
            <span className="fa fa-arrows-alt" aria-hidden="true" />
          </button>
        {/*
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Export diagram as PNG"
            onClick={this.onExportPNG}
          >
            <span className="fa fa-picture-o" aria-hidden="true" /> PNG
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Export diagram as SVG"
            onClick={this.onExportSVG}
          >
            <span className="fa fa-picture-o" aria-hidden="true" /> SVG
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Print diagram"
            onClick={this.props.onPrint}
          >
            <span className="fa fa-print" aria-hidden="true" />
          </button>
         */}
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Print diagram"
            onClick={window.print}
          >
            <span className="fa fa-print" aria-hidden="true" />
          </button>
          <span className="graph-explorer-toolbar__layout-group">
            &nbsp;
          </span>
          {this.renderLanguages()}
        </div>
      </div>
    );
  }
}
