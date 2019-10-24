import * as React from "react";
import { Api } from '@polkadot/react-api';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';
import Queue from '@polkadot/react-components/Status/Queue';

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";

export type Props = {
  closeModal: () => void;
  confirmClick: () => void;
};

type State = {};

const DefaultState: State = {};

// Todo: Get from redux store
const wsEndpoint = "ws://165.22.206.139:9944";


export class RunExtrinsics extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="run-extrinsics">
        <React.Suspense fallback="...">
          <Queue>
            <QueueConsumer>
              {({ queuePayload, queueSetTxStatus }: any): React.ReactNode => (
                <Api
                  queuePayload={queuePayload}
                  queueSetTxStatus={queueSetTxStatus}
                  url={wsEndpoint}
                >
                </Api>
              )}
            </QueueConsumer>
          </Queue>
        </React.Suspense>
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Confirm"
            onClick={() => this.handleConfirm()}
          />
        </div>
      </ModalComponent>
    );
  }

  private handleConfirm() {
    this.props.confirmClick();
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
