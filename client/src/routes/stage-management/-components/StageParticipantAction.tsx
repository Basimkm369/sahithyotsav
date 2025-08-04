import { Button } from '@/components/ui/button'
import { CompetitionDetails } from '../-hooks/useStageCompetitionDetails'


export default function StageParticipantAction({ data }: { data: CompetitionDetails }) {
    const { codeLetter, status } = data;
  
    if (!status && !codeLetter) {
      return null;
    }
  
    let label = '';
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' = 'default';
  
    if (!codeLetter && !status) {
      label = 'Reported';
      variant = 'secondary';
    } else if (!codeLetter && status === 'R') {
      label = 'Generate Code';
      variant = 'destructive';
    } else if (codeLetter && status === 'R') {
      label = 'Enroll';
      variant = 'default';
    } else if (codeLetter && status === 'E') {
      label = 'In Progress';
      variant = 'secondary';
    } else if (codeLetter && status === 'I') {
      label = 'Completed';
      variant = 'outline';
    } else {
      return null;
    }
  
    return (
      <Button variant={variant} size="sm" className="cursor-pointer">
        {label}
      </Button>
    );
  }
  
