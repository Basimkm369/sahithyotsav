import { executeQuery } from 'src/utils/db';
import { runSelectQuery, runWriteQuery } from 'src/utils/mysqlDb';

const populateFoodTeamDetails = async () => {
  const eventId = 52;

  try {
    const foodCheckins = await runSelectQuery(
      `SELECT id, chest_number FROM food_checkins 
         WHERE team_id IS NULL`,
    );

    if (foodCheckins.length === 0) {
      console.log('No new records to update.');
      return;
    }

    const teams = await executeQuery(
      `select tm.teamname as name,
                tm.teamno as number
            from ofm_team as tm 
              where tm.eventid = @eventId`,
      { eventId },
    );

    // Build lookup: chest_number → { number, name }
    const teamMap: any = {};
    for (const team of teams) {
      teamMap[team.number] = {
        id: team.number, // Assuming teamno is the unique ID
        name: team.name,
      };
    }

    // 3️⃣ Prepare updates
    const updates = [];
    for (const checkin of foodCheckins) {
      const team = teamMap[checkin.chest_number];
      if (team) {
        updates.push({
          id: checkin.id,
          teamId: team.id,
          teamName: team.name,
        });
      }
    }

    if (updates.length === 0) {
      console.log('No matching teams found.');
      return;
    }

    // 4️⃣ Build bulk update query
    const updateCasesId = updates
      .map((u) => `WHEN ${u.id} THEN ${u.teamId}`)
      .join(' ');

    const updateCasesName = updates
      .map((u) => `WHEN ${u.id} THEN '${u.teamName}'`)
      .join(' ');

    const ids = updates.map((u) => u.id).join(',');

    const updateQuery = `
      UPDATE food_checkins
      SET 
        team_id = CASE id
          ${updateCasesId}
        END,
        team_name = CASE id
          ${updateCasesName}
        END
      WHERE id IN (${ids})
    `;

    await runWriteQuery(updateQuery);

    console.log(`Updated ${updates.length} food_checkins records.`);
  } catch (err) {
    console.error('Error updating food_checkins:', err);
  }

  return '';
};
