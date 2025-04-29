import { JSX, ReactNode } from 'react';
import { ProgressProvider } from './progress';
import { ModelProvider } from './model';


interface ProviderProps {
  children: ReactNode;
}
type ProviderComponent = (props: ProviderProps) => JSX.Element;

interface ProviderComposerProps {
  providers: ProviderComponent[];
  children: ReactNode;
}

const ProviderComposer = ({ providers, children }: ProviderComposerProps) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const providers = [
    ProgressProvider,
    ModelProvider
  ];

  return <ProviderComposer providers={providers}>{children}</ProviderComposer>;
};
